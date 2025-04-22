# Dokument wymagań produktu (PRD) - FishIT

## 1. Przegląd produktu

FishIT to aplikacja webowa do efektywnego tworzenia i nauki z wykorzystaniem fiszek edukacyjnych, która rozwiązuje problem czasochłonnego manualnego tworzenia wysokiej jakości fiszek. Aplikacja wykorzystuje sztuczną inteligencję (Claude-3.7-sonnet) do automatycznego generowania fiszek w formacie pytanie-odpowiedź na podstawie tekstu wprowadzonego przez użytkownika.

Główne cechy produktu:
- Automatyczne generowanie fiszek przez AI na podstawie wprowadzonego tekstu
- Możliwość manualnego tworzenia, edycji i usuwania fiszek
- Organizacja fiszek w "pudełkach" związanych z notatkami źródłowymi
- Integracja z algorytmem spaced repetition (FSRS)
- Prosty system kont użytkowników do przechowywania fiszek

FishIT jest przeznaczony dla osób chcących efektywnie posiąść nową wiedzę, bez względu na dziedzinę. Aplikacja będzie dostępna jako darmowa usługa webowa w języku polskim, oparta na technologiach Angular 17 (frontend) i Supabase (backend).

## 2. Problem użytkownika

Spaced repetition to udowodniona naukowo, efektywna metoda nauki, która wykorzystuje fiszki do zapamiętywania informacji w optymalnych odstępach czasu. Jednak główną barierą w jej powszechnym stosowaniu jest czasochłonny proces tworzenia wysokiej jakości fiszek edukacyjnych:

1. Użytkownicy muszą manualnie wyodrębnić kluczowe informacje z materiałów źródłowych
2. Muszą sformułować pytania i odpowiedzi w sposób promujący aktywne przypominanie
3. Potrzebują dużo czasu na tworzenie wystarczającej liczby fiszek do efektywnej nauki

Proces ten jest na tyle pracochłonny, że zniechęca wielu potencjalnych użytkowników do korzystania z metody spaced repetition, mimo jej udowodnionej efektywności. FishIT rozwiązuje ten problem poprzez automatyzację procesu tworzenia fiszek z wykorzystaniem AI, pozwalając użytkownikom na szybkie generowanie wysokiej jakości fiszek na podstawie wprowadzonego tekstu.

## 3. Wymagania funkcjonalne

### 3.1 Zarządzanie kontem użytkownika
- Rejestracja użytkownika
- Logowanie do aplikacji
- Edycja podstawowych danych użytkownika
- Odzyskiwanie hasła

### 3.2 Generowanie fiszek przez AI
- Wprowadzanie tekstu źródłowego przez użytkownika (kopiuj-wklej)
- Określanie liczby fiszek do wygenerowania
- Przetwarzanie tekstu przez model AI (Claude-3.7-sonnet)
- Generowanie fiszek w formacie pytanie-odpowiedź
- Prezentacja wygenerowanych fiszek do recenzji

### 3.3 Zarządzanie fiszkami
- Recenzja wygenerowanych fiszek (akceptacja/edycja/odrzucanie)
- Manualne tworzenie fiszek
- Edycja istniejących fiszek
- Usuwanie fiszek
- Organizacja fiszek w "pudełkach"

### 3.4 Nauka z fiszkami
- Wybór pudełka do nauki
- Przeglądanie fiszek zgodnie z algorytmem FSRS
- Ocenianie trudności fiszek
- Pauza i kontynuacja sesji nauki
- Podgląd postępu nauki

### 3.5 Zarządzanie pudełkami z fiszkami
- Tworzenie nowych pudełek
- Edycja nazwy i opisu pudełka
- Usuwanie pudełka z potwierdzeniem
- Wyszukiwanie pudełek według nazwy
- Podgląd zawartości pudełka

## 4. Granice produktu

### 4.1 Co wchodzi w zakres MVP
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu
- Manualne tworzenie fiszek
- Przeglądanie, edycja i usuwanie fiszek
- Prosty system kont użytkowników
- Integracja z gotowym algorytmem spaced repetition (FSRS)
- Organizacja fiszek w pudełkach
- Wyszukiwanie pudełek po nazwie
- Responsywny interfejs webowy

### 4.2 Co NIE wchodzi w zakres MVP
- Własny, zaawansowany algorytm powtórek (jak SuperMemo, Anki)
- Import wielu formatów (PDF, DOCX, itp.)
- Współdzielenie zestawów fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne (na początek tylko web)
- Inteligentne wyszukiwanie zawartości pudełek
- Zaawansowane formatowanie treści fiszek
- Integracja z zewnętrznymi bibliotekami fiszek

## 5. Historyjki użytkowników

### Rejestracja i logowanie

US-001: Rejestracja nowego użytkownika
- Jako nowy użytkownik, chcę się zarejestrować w systemie, aby móc korzystać z aplikacji FishIT.
- Kryteria akceptacji:
  1. Użytkownik może się zarejestrować podając: login, hasło i email
  2. System weryfikuje unikalność loginu i adresu email
  3. System waliduje poprawność formatu adresu email
  4. Po poprawnej rejestracji użytkownik jest przekierowywany do ekranu logowania
  5. W przypadku błędu system wyświetla odpowiedni komunikat

US-002: Logowanie do aplikacji
- Jako zarejestrowany użytkownik, chcę się zalogować do aplikacji, aby uzyskać dostęp do moich fiszek.
- Kryteria akceptacji:
  1. Użytkownik może zalogować się podając login i hasło
  2. System weryfikuje poprawność danych logowania
  3. Po poprawnym logowaniu użytkownik jest przekierowywany do strony głównej
  4. W przypadku błędnych danych system wyświetla odpowiedni komunikat
  5. Istnieje opcja "Zapomniałem hasła"

US-003: Odzyskiwanie hasła
- Jako użytkownik, który zapomniał hasła, chcę zresetować moje hasło, aby ponownie uzyskać dostęp do konta.
- Kryteria akceptacji:
  1. Użytkownik może zainicjować proces resetowania hasła podając adres email
  2. System wysyła link do resetowania hasła na podany adres email
  3. Link do resetowania hasła jest ważny przez 24 godziny
  4. Użytkownik może ustawić nowe hasło po kliknięciu w link
  5. System potwierdza zmianę hasła

US-004: Wylogowanie z aplikacji
- Jako zalogowany użytkownik, chcę się wylogować z aplikacji, aby zabezpieczyć moje konto.
- Kryteria akceptacji:
  1. Przycisk wylogowania jest dostępny na każdym ekranie
  2. Po wylogowaniu użytkownik jest przekierowywany do ekranu logowania
  3. Po wylogowaniu dostęp do funkcji aplikacji jest niemożliwy bez ponownego logowania

### Generowanie i zarządzanie fiszkami

US-005: Wprowadzanie tekstu źródłowego
- Jako użytkownik, chcę wkleić tekst źródłowy do systemu, aby wygenerować z niego fiszki.
- Kryteria akceptacji:
  1. System udostępnia pole tekstowe do wprowadzenia tekstu
  2. Pole akceptuje tekst o długości do 10000 znaków
  3. System waliduje czy pole nie jest puste przed próbą generowania
  4. Użytkownik może wyczyścić pole jednym kliknięciem

US-006: Określanie liczby generowanych fiszek
- Jako użytkownik, chcę określić liczbę fiszek do wygenerowania, aby dostosować ilość materiału do nauki.
- Kryteria akceptacji:
  1. System udostępnia pole numeryczne do wprowadzenia liczby fiszek
  2. Domyślna liczba fiszek to 10
  3. Minimalna liczba fiszek to 1, maksymalna to 50
  4. System waliduje wprowadzoną wartość

US-007: Generowanie fiszek przez AI
- Jako użytkownik, chcę wygenerować fiszki na podstawie wprowadzonego tekstu, aby zaoszczędzić czas.
- Kryteria akceptacji:
  1. System wysyła tekst do API Claude-3.7-sonnet wraz z określoną liczbą fiszek
  2. System wyświetla informację o trwającym procesie generowania
  3. Wygenerowane fiszki są prezentowane w formie pytanie-odpowiedź
  4. W przypadku błędu system wyświetla odpowiedni komunikat
  5. Czas generowania nie przekracza 20 sekund dla tekstu o długości 5000 znaków

US-008: Recenzja wygenerowanych fiszek
- Jako użytkownik, chcę przeglądać i recenzować wygenerowane fiszki, aby zachować tylko te wysokiej jakości.
- Kryteria akceptacji:
  1. System prezentuje listę wygenerowanych fiszek
  2. Dla każdej fiszki dostępne są przyciski: "Akceptuj", "Edytuj" i "Odrzuć"
  3. Po kliknięciu "Akceptuj" fiszka jest dodawana do zestawu
  4. Po kliknięciu "Odrzuć" fiszka jest usuwana z listy
  5. Po kliknięciu "Edytuj" otwiera się formularz edycji fiszki

US-009: Edycja fiszki
- Jako użytkownik, chcę edytować fiszkę, aby poprawić jej jakość lub dostosować do moich potrzeb.
- Kryteria akceptacji:
  1. System wyświetla formularz z polami: pytanie i odpowiedź
  2. Pola są wypełnione aktualnymi wartościami fiszki
  3. Po edycji i zatwierdzeniu fiszka jest aktualizowana
  4. Można anulować edycję bez zapisywania zmian
  5. System waliduje czy oba pola są wypełnione

US-010: Manualne tworzenie fiszki
- Jako użytkownik, chcę manualnie utworzyć fiszkę, aby dodać treści, których nie ma w tekście źródłowym.
- Kryteria akceptacji:
  1. System udostępnia formularz z polami: pytanie i odpowiedź
  2. Po wypełnieniu i zatwierdzeniu fiszka jest dodawana do zestawu
  3. System waliduje czy oba pola są wypełnione
  4. Można anulować tworzenie bez dodawania fiszki

US-011: Usuwanie fiszki
- Jako użytkownik, chcę usunąć fiszkę, aby pozbyć się niepotrzebnych lub nieaktualnych treści.
- Kryteria akceptacji:
  1. Przy każdej fiszce dostępna jest opcja usunięcia
  2. System wymaga potwierdzenia przed usunięciem
  3. Po usunięciu fiszka nie jest już dostępna w zestawie
  4. System wyświetla potwierdzenie udanego usunięcia

### Zarządzanie pudełkami

US-012: Tworzenie pudełka z fiszkami
- Jako użytkownik, chcę utworzyć nowe pudełko, aby zorganizować fiszki tematycznie.
- Kryteria akceptacji:
  1. System udostępnia formularz tworzenia pudełka z polami: nazwa i opcjonalny opis
  2. Po wypełnieniu i zatwierdzeniu pudełko jest tworzone
  3. System waliduje unikalność nazwy pudełka dla użytkownika
  4. Nowe pudełko pojawia się na liście pudełek użytkownika

US-013: Zapisywanie fiszek do pudełka
- Jako użytkownik, chcę zapisać zaakceptowane fiszki do pudełka, aby zachować je do nauki.
- Kryteria akceptacji:
  1. Po recenzji fiszek system proponuje zapisanie ich do pudełka
  2. Użytkownik może wybrać istniejące pudełko lub utworzyć nowe
  3. System potwierdza zapisanie fiszek do wybranego pudełka
  4. Fiszki są zapisywane wraz z informacją o tekście źródłowym

US-014: Przeglądanie listy pudełek
- Jako użytkownik, chcę przeglądać listę moich pudełek, aby zarządzać nimi.
- Kryteria akceptacji:
  1. System wyświetla listę wszystkich pudełek użytkownika
  2. Dla każdego pudełka widoczne są: nazwa, opis i liczba fiszek
  3. Lista jest posortowana alfabetycznie
  4. Dostępne są opcje: nauka, edycja i usunięcie pudełka

US-015: Wyszukiwanie pudełek
- Jako użytkownik, chcę wyszukiwać pudełka po nazwie, aby szybko znaleźć potrzebne materiały.
- Kryteria akceptacji:
  1. System udostępnia pole wyszukiwania pudełek
  2. Wyszukiwanie działa po wpisaniu co najmniej 2 znaków
  3. Wyniki są aktualizowane na bieżąco
  4. Wyświetlane są pudełka zawierające wyszukiwaną frazę w nazwie

US-016: Podgląd zawartości pudełka
- Jako użytkownik, chcę przeglądać zawartość pudełka, aby sprawdzić fiszki przed nauką.
- Kryteria akceptacji:
  1. System wyświetla listę wszystkich fiszek w pudełku
  2. Dla każdej fiszki widoczne są: pytanie i odpowiedź
  3. Dostępne są opcje: edycja i usunięcie fiszki
  4. System wyświetla informację o tekście źródłowym

US-017: Edycja pudełka
- Jako użytkownik, chcę edytować nazwę i opis pudełka, aby zaktualizować jego informacje.
- Kryteria akceptacji:
  1. System udostępnia formularz edycji z polami: nazwa i opis
  2. Pola są wypełnione aktualnymi wartościami pudełka
  3. Po edycji i zatwierdzeniu pudełko jest aktualizowane
  4. System waliduje unikalność nowej nazwy pudełka

US-018: Usuwanie pudełka
- Jako użytkownik, chcę usunąć pudełko, aby pozbyć się niepotrzebnych materiałów.
- Kryteria akceptacji:
  1. System wymaga potwierdzenia przed usunięciem
  2. Potwierdzenie informuje o liczbie fiszek, które zostaną usunięte
  3. Po usunięciu pudełko i wszystkie jego fiszki nie są już dostępne
  4. System wyświetla potwierdzenie udanego usunięcia

### Nauka z fiszkami

US-019: Rozpoczęcie sesji nauki
- Jako użytkownik, chcę rozpocząć sesję nauki z wybranym pudełkiem, aby uczyć się zawartych w nim informacji.
- Kryteria akceptacji:
  1. System inicjuje sesję nauki z algorytmem FSRS
  2. Fiszki są prezentowane zgodnie z algorytmem
  3. System wyświetla informację o liczbie fiszek dostępnych do nauki
  4. Sesja rozpoczyna się od pierwszej fiszki zgodnie z algorytmem

US-020: Przeglądanie fiszki podczas nauki
- Jako użytkownik, chcę zobaczyć pytanie z fiszki, zastanowić się nad odpowiedzią, a następnie zobaczyć prawidłową odpowiedź.
- Kryteria akceptacji:
  1. System najpierw pokazuje tylko pytanie
  2. Użytkownik może samodzielnie sprawdzić odpowiedź
  3. Po sprawdzeniu pokazywane jest pytanie i odpowiedź
  4. Dostępne są przyciski do oceny trudności fiszki

US-021: Ocenianie trudności fiszki
- Jako użytkownik, chcę ocenić trudność fiszki, aby algorytm mógł dostosować harmonogram powtórek.
- Kryteria akceptacji:
  1. System udostępnia skalę oceny trudności zgodną z FSRS (1-4)
  2. Po ocenieniu system przechodzi do następnej fiszki
  3. Ocena jest zapisywana i wpływa na harmonogram powtórek
  4. System wyświetla krótkie wyjaśnienie każdej oceny

US-022: Pauza i kontynuacja sesji nauki
- Jako użytkownik, chcę zrobić pauzę w sesji nauki i kontynuować ją później, aby dostosować naukę do mojego harmonogramu.
- Kryteria akceptacji:
  1. Dostępny jest przycisk pauzy podczas sesji
  2. System zapisuje postęp sesji po naciśnięciu pauzy
  3. Użytkownik może wrócić do sesji z miejsca, w którym ją przerwał
  4. System potwierdza zapisanie postępu

US-023: Zakończenie sesji nauki
- Jako użytkownik, chcę zakończyć sesję nauki i zobaczyć podsumowanie, aby ocenić swój postęp.
- Kryteria akceptacji:
  1. System wyświetla podsumowanie po przejrzeniu wszystkich fiszek
  2. Podsumowanie zawiera: liczbę przeglądniętych fiszek i oceny
  3. System informuje o dacie następnej sugerowanej sesji
  4. Dostępna jest opcja powrotu do listy pudełek

## 6. Metryki sukcesu

### 6.1 Metryki produktowe
- 75% fiszek wygenerowanych przez AI jest akceptowane przez użytkownika bez edycji
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI (a nie manualnie)
- Średni czas generowania zestawu 10 fiszek nie przekracza 15 sekund
- 90% użytkowników korzysta z aplikacji regularnie (co najmniej raz w tygodniu)

### 6.2 Metryki użytkownika
- Użytkownicy kończą co najmniej 80% rozpoczętych sesji nauki
- Średni czas tworzenia zestawu 10 fiszek (włącznie z recenzją) nie przekracza 3 minut
- 70% użytkowników tworzy więcej niż jeden zestaw fiszek
- Użytkownicy wracają do nauki z tym samym zestawem fiszek co najmniej 3 razy

### 6.3 Metryki biznesowe
- Liczba aktywnych użytkowników miesięcznie wzrasta o 15%
- Utrzymanie użytkowników (retencja) na poziomie 50% po miesiącu
- Koszt pozyskania użytkownika nie przekracza ustalonego budżetu
- Koszt infrastruktury i API AI pozostaje w ramach założonego modelu biznesowego 