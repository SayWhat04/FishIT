import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { BoxesPageComponent } from './boxes-page.component';
import { BoxService } from '../../../services/box.service';
import { AddBoxDialogComponent } from '../add-box-dialog/add-box-dialog.component';
import { EditBoxDialogComponent } from '../edit-box-dialog/edit-box-dialog.component';
import { BoxDto } from '@shared/types/dto';

describe('BoxesPageComponent', () => {
  let component: BoxesPageComponent;
  let fixture: ComponentFixture<BoxesPageComponent>;
  let mockBoxService: jasmine.SpyObj<BoxService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockBoxes: BoxDto[] = [
    {
      id: '1',
      name: 'Test Box 1',
      description: 'Description 1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      user_id: 'user1',
      flashcard_count: 5,
      is_deleted: false
    },
    {
      id: '2',
      name: 'Test Box 2',
      description: 'Description 2',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      user_id: 'user1',
      flashcard_count: 10,
      is_deleted: false
    },
    {
      id: '3',
      name: 'Angular Box',
      description: 'Angular learning',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
      user_id: 'user1',
      flashcard_count: 0,
      is_deleted: false
    }
  ];

  beforeEach(async () => {
    const boxServiceSpy = jasmine.createSpyObj('BoxService', ['getBoxes']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        BoxesPageComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BoxService, useValue: boxServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoxesPageComponent);
    component = fixture.componentInstance;
    mockBoxService = TestBed.inject(BoxService) as jasmine.SpyObj<BoxService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.boxes()).toEqual([]);
      expect(component.searchQuery()).toBe('');
      expect(component.isLoading()).toBe(false);
      expect(component.error()).toBe(null);
    });

    it('should load boxes on ngOnInit', () => {
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));
      
      component.ngOnInit();
      
      expect(mockBoxService.getBoxes).toHaveBeenCalledWith(true);
      expect(component.boxes()).toEqual(mockBoxes);
      expect(component.isLoading()).toBe(false);
    });

    it('should handle error when loading boxes fails', () => {
      const errorMessage = 'Network error';
      mockBoxService.getBoxes.and.returnValue(throwError(() => new Error(errorMessage)));
      
      component.ngOnInit();
      
      expect(component.error()).toBe('Failed to load boxes. Please try again.');
      expect(component.isLoading()).toBe(false);
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Failed to load boxes. Please try again.',
        'OK',
        { duration: 5000 }
      );
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      component.boxes.set(mockBoxes);
    });

    it('should filter boxes by name', () => {
      component.onSearchChange('Angular');
      
      expect(component.filteredBoxes().length).toBe(1);
      expect(component.filteredBoxes()[0].name).toBe('Angular Box');
    });

    it('should filter boxes by description', () => {
      component.onSearchChange('learning');
      
      expect(component.filteredBoxes().length).toBe(1);
      expect(component.filteredBoxes()[0].description).toBe('Angular learning');
    });

    it('should be case insensitive', () => {
      component.onSearchChange('ANGULAR');
      
      expect(component.filteredBoxes().length).toBe(1);
      expect(component.filteredBoxes()[0].name).toBe('Angular Box');
    });

    it('should return all boxes when search query is empty', () => {
      component.onSearchChange('');
      
      expect(component.filteredBoxes().length).toBe(3);
      expect(component.filteredBoxes()).toEqual(mockBoxes);
    });

    it('should return empty array when no matches found', () => {
      component.onSearchChange('nonexistent');
      
      expect(component.filteredBoxes().length).toBe(0);
    });

    it('should trim whitespace from search query', () => {
      component.onSearchChange('  Angular  ');
      
      expect(component.filteredBoxes().length).toBe(1);
      expect(component.filteredBoxes()[0].name).toBe('Angular Box');
    });
  });

  describe('Box Management Actions', () => {
    it('should open create box dialog', () => {
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialogRef.afterClosed = jasmine.createSpy().and.returnValue(of(true));
      mockDialog.open.and.returnValue(mockDialogRef as any);
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));

      component.onCreateBox();

      expect(mockDialog.open).toHaveBeenCalledWith(AddBoxDialogComponent, {
        width: '500px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: true,
        restoreFocus: true,
        panelClass: 'custom-dialog-container',
        disableClose: false
      });
    });

    it('should reload boxes and show success message after creating box', () => {
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));

      component.onCreateBox();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Box created successfully!',
        'OK',
        { duration: 3000 }
      );
      expect(mockBoxService.getBoxes).toHaveBeenCalledWith(true);
    });

    it('should not reload boxes when create dialog is cancelled', () => {
      const mockDialogRef = {
        afterClosed: () => of(null)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.onCreateBox();

      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(mockBoxService.getBoxes).not.toHaveBeenCalled();
    });

    it('should navigate to box view', () => {
      const boxId = '123';
      
      component.onViewBox(boxId);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/boxes', boxId]);
    });

    it('should show not implemented message for study', () => {
      const boxId = '123';
      
      component.onStartStudy(boxId);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Study functionality is not yet implemented.',
        'OK',
        { duration: 3000 }
      );
    });

    it('should open edit box dialog', () => {
      const testBox = mockBoxes[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));

      component.onEditBox(testBox);

      expect(mockDialog.open).toHaveBeenCalledWith(EditBoxDialogComponent, {
        width: '500px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: true,
        restoreFocus: true,
        panelClass: 'custom-dialog-container',
        disableClose: false,
        data: { box: testBox }
      });
    });

    it('should reload boxes and show success message after editing box', () => {
      const testBox = mockBoxes[0];
      const mockDialogRef = {
        afterClosed: () => of(true)
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));

      component.onEditBox(testBox);

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Box updated successfully!',
        'OK',
        { duration: 3000 }
      );
      expect(mockBoxService.getBoxes).toHaveBeenCalledWith(true);
    });

    it('should show not implemented message for delete', () => {
      const testBox = mockBoxes[0];
      
      component.onDeleteBox(testBox);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Box delete functionality is not yet implemented.',
        'OK',
        { duration: 3000 }
      );
    });

    it('should refresh boxes', () => {
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));
      
      component.onRefresh();
      
      expect(mockBoxService.getBoxes).toHaveBeenCalledWith(true);
    });
  });

  describe('Helper Methods', () => {
    it('should get flashcard count from box', () => {
      const box = mockBoxes[0]; // flashcard_count: 5
      
      const count = component.getFlashcardCount(box);
      
      expect(count).toBe(5);
    });

    it('should return 0 when flashcard_count is undefined', () => {
      const box = { ...mockBoxes[0] };
      delete (box as any).flashcard_count;
      
      const count = component.getFlashcardCount(box);
      
      expect(count).toBe(0);
    });

    it('should format date to Polish locale', () => {
      const dateString = '2024-01-15T10:30:00Z';
      
      const formattedDate = component.formatDate(dateString);
      
      expect(formattedDate).toMatch(/15 sty 2024|15 I 2024/); // Different browsers may format differently
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      mockBoxService.getBoxes.and.returnValue(of(mockBoxes));
      fixture.detectChanges();
    });

    it('should display loading spinner when loading', () => {
      component.isLoading.set(true);
      fixture.detectChanges();
      
      const loadingElement = fixture.nativeElement.querySelector('mat-spinner');
      expect(loadingElement).toBeTruthy();
    });

    it('should display error message when error occurs', () => {
      component.error.set('Test error message');
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-container');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Test error message');
    });

    it('should display empty state when no boxes', () => {
      component.boxes.set([]);
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const emptyStateElement = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyStateElement).toBeTruthy();
      expect(emptyStateElement.textContent).toContain('No boxes yet');
    });

    it('should display no results when search returns empty', () => {
      component.boxes.set(mockBoxes);
      component.searchQuery.set('nonexistent');
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const noResultsElement = fixture.nativeElement.querySelector('.no-results');
      expect(noResultsElement).toBeTruthy();
      expect(noResultsElement.textContent).toContain('No boxes found');
    });

    it('should display boxes when data is loaded', () => {
      component.boxes.set(mockBoxes);
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const boxCards = fixture.nativeElement.querySelectorAll('.box-card');
      expect(boxCards.length).toBe(3);
    });

    it('should update search query when input changes', () => {
      const searchInput = fixture.nativeElement.querySelector('input[matInput]');
      searchInput.value = 'Angular';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.searchQuery()).toBe('Angular');
    });

    it('should call onCreateBox when create button is clicked', () => {
      spyOn(component, 'onCreateBox');
      
      const createButton = fixture.nativeElement.querySelector('.create-box-btn');
      createButton.click();
      
      expect(component.onCreateBox).toHaveBeenCalled();
    });

    it('should call onRefresh when refresh button is clicked', () => {
      spyOn(component, 'onRefresh');
      
      const refreshButton = fixture.nativeElement.querySelector('.refresh-btn');
      refreshButton.click();
      
      expect(component.onRefresh).toHaveBeenCalled();
    });

    it('should display correct flashcard count in box cards', () => {
      component.boxes.set(mockBoxes);
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const statItems = fixture.nativeElement.querySelectorAll('.stat-item');
      const flashcardStats = Array.from(statItems).filter((item: any) => 
        item.textContent?.includes('Flashcards:')
      ) as Element[];
      
      expect(flashcardStats.length).toBe(3);
      expect((flashcardStats[0] as any).textContent).toContain('5');
      expect((flashcardStats[1] as any).textContent).toContain('10');
      expect((flashcardStats[2] as any).textContent).toContain('0');
    });

    it('should disable study button when box has no flashcards', () => {
      component.boxes.set(mockBoxes);
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const studyButtons = fixture.nativeElement.querySelectorAll('.study-btn');
      const emptyBoxStudyButton = studyButtons[2]; // Third box has 0 flashcards
      
      expect(emptyBoxStudyButton.disabled).toBe(true);
    });

    it('should enable study button when box has flashcards', () => {
      component.boxes.set(mockBoxes);
      component.isLoading.set(false);
      fixture.detectChanges();
      
      const studyButtons = fixture.nativeElement.querySelectorAll('.study-btn');
      const firstBoxStudyButton = studyButtons[0]; // First box has 5 flashcards
      
      expect(firstBoxStudyButton.disabled).toBe(false);
    });
  });
});