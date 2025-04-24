# Schemat bazy danych FishIT

## 1. Tabele

### `auth.users` (zarządzana przez Supabase Auth)
- **id**: UUID, PRIMARY KEY - Unikalny identyfikator użytkownika
- **email**: TEXT, UNIQUE, NOT NULL - Adres email użytkownika
- **encrypted_password**: TEXT, NOT NULL - Zaszyfrowane hasło użytkownika
- **created_at**: TIMESTAMPTZ, NOT NULL - Data utworzenia konta
- **updated_at**: TIMESTAMPTZ, NOT NULL - Data ostatniej aktualizacji

### `public.boxes`
- **id**: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4() - Unikalny identyfikator pudełka
- **user_id**: UUID, NOT NULL, REFERENCES auth.users(id) - Identyfikator właściciela pudełka
- **name**: TEXT, NOT NULL - Nazwa pudełka
- **description**: TEXT - Opcjonalny opis pudełka
- **flashcard_count**: INTEGER, NOT NULL, DEFAULT 0 - Licznik fiszek w pudełku
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data utworzenia pudełka
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data ostatniej aktualizacji pudełka
- **is_deleted**: BOOLEAN, NOT NULL, DEFAULT FALSE - Flaga soft delete

### `public.flashcards`
- **id**: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4() - Unikalny identyfikator fiszki
- **box_id**: UUID, NOT NULL, REFERENCES public.boxes(id) - Identyfikator pudełka zawierającego fiszkę
- **front**: TEXT, NOT NULL - Pytanie (przednia strona fiszki)
- **back**: TEXT, NOT NULL - Odpowiedź (tylna strona fiszki)
- **is_ai_generated**: BOOLEAN, NOT NULL, DEFAULT FALSE - Czy fiszka została wygenerowana przez AI
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data utworzenia fiszki
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data ostatniej aktualizacji fiszki
- **is_deleted**: BOOLEAN, NOT NULL, DEFAULT FALSE - Flaga soft delete

### `public.tags`
- **id**: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4() - Unikalny identyfikator tagu
- **name**: CITEXT, NOT NULL, UNIQUE - Nazwa tagu (case-insensitive)
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data utworzenia tagu

### `public.box_tags`
- **id**: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4() - Unikalny identyfikator powiązania
- **box_id**: UUID, NOT NULL, REFERENCES public.boxes(id) - Identyfikator pudełka
- **tag_id**: UUID, NOT NULL, REFERENCES public.tags(id) - Identyfikator tagu
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data utworzenia powiązania

### `public.generation_log`
- **id**: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4() - Unikalny identyfikator logu
- **user_id**: UUID, NOT NULL, REFERENCES auth.users(id) - Identyfikator użytkownika
- **flashcard_id**: UUID, REFERENCES public.flashcards(id) - Identyfikator fiszki (NULL jeśli odrzucona)
- **original_front**: TEXT, NOT NULL - Oryginalne pytanie przed edycją
- **original_back**: TEXT, NOT NULL - Oryginalna odpowiedź przed edycją
- **status**: TEXT, NOT NULL, CHECK (status IN ('accepted', 'rejected', 'edited')) - Status decyzji użytkownika
- **generation_info**: JSONB - Dodatkowe informacje o procesie generowania
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW() - Data utworzenia logu

## 2. Relacje między tabelami

1. **Users ↔ Boxes**: Jeden-do-wielu
   - Jeden użytkownik może mieć wiele pudełek
   - Każde pudełko należy do jednego użytkownika

2. **Boxes ↔ Flashcards**: Jeden-do-wielu
   - Jedno pudełko może zawierać wiele fiszek
   - Każda fiszka należy do jednego pudełka

3. **Boxes ↔ Tags**: Wiele-do-wielu (poprzez `box_tags`)
   - Jedno pudełko może mieć wiele tagów
   - Jeden tag może być przypisany do wielu pudełek

4. **Users ↔ Generation_log**: Jeden-do-wielu
   - Jeden użytkownik może mieć wiele wpisów w logu generowania
   - Każdy wpis w logu należy do jednego użytkownika

5. **Flashcards ↔ Generation_log**: Jeden-do-jeden (opcjonalny)
   - Jedna fiszka może mieć jeden wpis w logu generowania
   - Wpis w logu może być powiązany z jedną fiszką lub z żadną (jeśli odrzucona)

## 3. Indeksy

```sql
-- Indeksy dla tabeli boxes
CREATE INDEX idx_boxes_user_id ON public.boxes(user_id);
CREATE INDEX idx_boxes_is_deleted ON public.boxes(is_deleted);
CREATE INDEX idx_boxes_name ON public.boxes(name) WHERE is_deleted = FALSE;

-- Indeksy dla tabeli flashcards
CREATE INDEX idx_flashcards_box_id ON public.flashcards(box_id);
CREATE INDEX idx_flashcards_is_deleted ON public.flashcards(is_deleted);
CREATE INDEX idx_flashcards_box_id_is_deleted ON public.flashcards(box_id, is_deleted);

-- Indeksy dla tabeli box_tags
CREATE INDEX idx_box_tags_box_id ON public.box_tags(box_id);
CREATE INDEX idx_box_tags_tag_id ON public.box_tags(tag_id);
CREATE UNIQUE INDEX idx_box_tags_box_id_tag_id ON public.box_tags(box_id, tag_id);

-- Indeksy dla tabeli generation_log
CREATE INDEX idx_generation_log_user_id ON public.generation_log(user_id);
CREATE INDEX idx_generation_log_flashcard_id ON public.generation_log(flashcard_id);
CREATE INDEX idx_generation_log_status ON public.generation_log(status);
```

## 4. Triggery i funkcje

### Trigger do aktualizacji licznika fiszek w pudełku

```sql
-- Funkcja aktualizująca licznik fiszek
CREATE OR REPLACE FUNCTION update_flashcard_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_deleted = FALSE THEN
      UPDATE public.boxes
      SET flashcard_count = flashcard_count + 1
      WHERE id = NEW.box_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_deleted = TRUE AND NEW.is_deleted = FALSE THEN
      UPDATE public.boxes
      SET flashcard_count = flashcard_count + 1
      WHERE id = NEW.box_id;
    ELSIF OLD.is_deleted = FALSE AND NEW.is_deleted = TRUE THEN
      UPDATE public.boxes
      SET flashcard_count = flashcard_count - 1
      WHERE id = NEW.box_id;
    ELSIF OLD.box_id <> NEW.box_id THEN
      IF NEW.is_deleted = FALSE THEN
        UPDATE public.boxes
        SET flashcard_count = flashcard_count + 1
        WHERE id = NEW.box_id;
      END IF;
      IF OLD.is_deleted = FALSE THEN
        UPDATE public.boxes
        SET flashcard_count = flashcard_count - 1
        WHERE id = OLD.box_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_deleted = FALSE THEN
      UPDATE public.boxes
      SET flashcard_count = flashcard_count - 1
      WHERE id = OLD.box_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger do aktualizacji licznika fiszek
CREATE TRIGGER trg_flashcards_update_count
AFTER INSERT OR UPDATE OR DELETE ON public.flashcards
FOR EACH ROW EXECUTE FUNCTION update_flashcard_count();
```

### Funkcja do sprawdzania liczby tagów w pudełku

```sql
-- Funkcja sprawdzająca limit tagów (max 10 na pudełko)
CREATE OR REPLACE FUNCTION check_box_tags_limit()
RETURNS TRIGGER AS $$
DECLARE
  tag_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tag_count
  FROM public.box_tags
  WHERE box_id = NEW.box_id;
  
  IF tag_count >= 10 THEN
    RAISE EXCEPTION 'Pudełko nie może mieć więcej niż 10 tagów';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do sprawdzania limitu tagów
CREATE TRIGGER trg_box_tags_limit
BEFORE INSERT ON public.box_tags
FOR EACH ROW EXECUTE FUNCTION check_box_tags_limit();
```

## 5. Polityki Row Level Security (RLS)

```sql
-- Włączenie RLS dla tabel
ALTER TABLE public.boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_log ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla pudełek
CREATE POLICY boxes_select_policy ON public.boxes
  FOR SELECT USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY boxes_insert_policy ON public.boxes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY boxes_update_policy ON public.boxes
  FOR UPDATE USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY boxes_delete_policy ON public.boxes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (is_deleted = TRUE);

-- Polityki RLS dla fiszek
CREATE POLICY flashcards_select_policy ON public.flashcards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.flashcards.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    ) AND is_deleted = FALSE
  );

CREATE POLICY flashcards_insert_policy ON public.flashcards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.flashcards.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    )
  );

CREATE POLICY flashcards_update_policy ON public.flashcards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.flashcards.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    ) AND is_deleted = FALSE
  );

CREATE POLICY flashcards_delete_policy ON public.flashcards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.flashcards.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    )
  ) WITH CHECK (is_deleted = TRUE);

-- Polityki RLS dla powiązań pudełek z tagami
CREATE POLICY box_tags_select_policy ON public.box_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.box_tags.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    )
  );

CREATE POLICY box_tags_insert_policy ON public.box_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.box_tags.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    )
  );

CREATE POLICY box_tags_delete_policy ON public.box_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.boxes
      WHERE public.boxes.id = public.box_tags.box_id
      AND public.boxes.user_id = auth.uid()
      AND public.boxes.is_deleted = FALSE
    )
  );

-- Polityki RLS dla logów generowania
CREATE POLICY generation_log_select_policy ON public.generation_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY generation_log_insert_policy ON public.generation_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 6. Uwagi dodatkowe

1. **Autentykacja i zarządzanie użytkownikami:**
   - Wykorzystujemy Supabase Auth do zarządzania użytkownikami
   - Tabela `auth.users` jest zarządzana automatycznie przez Supabase

2. **Soft delete:**
   - Zamiast fizycznego usuwania danych, używamy flagi `is_deleted`
   - Pozwala to na zachowanie historii i potencjalne odzyskiwanie danych
   - Wszytkie polityki RLS uwzględniają flagę soft delete

3. **Licznik fiszek:**
   - Trigger automatycznie aktualizuje licznik fiszek w pudełku
   - Uwzględnia operacje INSERT, UPDATE i DELETE oraz soft delete

4. **Ograniczenie liczby tagów:**
   - Trigger sprawdza, czy pudełko nie przekracza limitu 10 tagów
   - Zwraca błąd, jeśli próba dodania tagu przekracza limit

5. **Tagi:**
   - Używamy typu CITEXT dla nazw tagów, co zapewnia wyszukiwanie niewrażliwe na wielkość liter
   - Tagi są globalne (współdzielone między użytkownikami)

6. **Generation log:**
   - Przechowuje informacje o procesie generowania fiszek przez AI
   - Status może mieć wartości: 'accepted', 'rejected', 'edited'
   - Pole `generation_info` (JSONB) pozwala na elastyczne przechowywanie dodatkowych informacji

7. **Indeksy:**
   - Zoptymalizowane pod kątem częstych operacji wyszukiwania
   - Uwzględniają soft delete w warunkach WHERE

8. **Row Level Security:**
   - Zapewnia, że użytkownicy mają dostęp tylko do własnych danych
   - Polityki skonfigurowane dla wszystkich operacji CRUD 