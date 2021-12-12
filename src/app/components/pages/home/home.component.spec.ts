import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { UserModel } from '../../models/data';

import { HomeComponent } from './home.component';
import { DebugElement } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { of } from 'rxjs';
import { ElipsesPipeFifty, ElipsesPipeThirty, ElipsesPipeTwenty } from 'src/app/services/pipes';
import { HeaderComponent } from '../../reusables/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from '../../reusables/loader/loader.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement

  let dataService: DataService
  let utilsService: UtilsService
  let mockDataService

  let mockUsersData: Array<UserModel> = [
    {
      gender: {
        id: 1,
        name: "Male"
      },
      firstName: "James",
      lastName: "Blunt",
      symptoms: [
        {
          id: 1,
          name: "headache"
        },
        {
          id: 2,
          name: "nausea"
        }
      ],
      id: 1
    }
  ]

  let mockGenderData = [
    {
      id: 1,
      name: "Male"
    },
    {
      id: 2,
      name: "Female"
    },
  ]

  let mockSymptomsData = [
    {
      id: 1,
      name: "headache"
    },
    {
      id: 2,
      name: "nausea"
    }
  ]

  let mockEditResponse = {
    gender: {
      id: 1,
      name: "Male"
    },
    firstName: "James",
    lastName: "Blunt",
    symptoms: [
      {
        id: 1,
        name: "headache"
      },
      {
        id: 2,
        name: "nausea"
      }
    ],
    id: 1
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        HeaderComponent,
        LoaderComponent,
        ElipsesPipeFifty,
        ElipsesPipeThirty,
        ElipsesPipeTwenty
      ],
      imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
      ],
      providers: [
        UtilsService,
        {
          provide: DataService,
          useValue: jasmine.createSpyObj('DataService', ['getAllUsers', 'getAllGenders', 'getAllSymptoms'])
        },
      ],
    }).compileComponents();
    mockDataService = TestBed.get(DataService)
    mockDataService.getAllUsers.and.returnValue(of(mockUsersData))
    mockDataService.getAllGenders.and.returnValue(of(mockGenderData))
    mockDataService.getAllSymptoms.and.returnValue(of(mockSymptomsData))
  });



  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create home component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all data required from data service', () => {
    spyOn(component, 'fetchUsers')
    spyOn(component, 'fetchSymptoms')
    spyOn(component, 'fetchGenders')
    component.ngOnInit();

    expect(component.fetchUsers).toHaveBeenCalled();
    expect(component.fetchSymptoms).toHaveBeenCalled();
    expect(component.fetchGenders).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsersData);
    expect(component.symptomsArray).toEqual(mockSymptomsData);
    expect(component.genderArray).toEqual(mockGenderData);
  });

  it('should display uneditable data when edit mode is not called', () => {
    let lastName = fixture.debugElement.nativeElement.querySelector('#lastName')
    let gender = fixture.debugElement.nativeElement.querySelector('#gender')
    let symptoms = fixture.debugElement.nativeElement.querySelector('#multipleSelect')
    let buttonRow = fixture.debugElement.nativeElement.querySelector('#button-row')
    let buttonRowStyle = getComputedStyle(buttonRow);

    expect(lastName.innerText).toContain('Blunt');
    expect(gender.innerText).toContain('Male');
    expect(symptoms.innerText).toContain('Headache');
    expect(buttonRowStyle.visibility).toBe('hidden');
  })
  it('should not display button and editable fields when edit mode is not called', () => {
    let firstNameInput = fixture.debugElement.nativeElement.querySelector('#InputInput')
    let lastNameInput = fixture.debugElement.nativeElement.querySelector('#lastNameInput')
    let genderInput = fixture.debugElement.nativeElement.querySelector('#editableGender')
    let symptomsInput = fixture.debugElement.nativeElement.querySelector('#multipleSelectEdit')
    let buttonRow = fixture.debugElement.nativeElement.querySelector('#button-row')
    let buttonRowStyle = getComputedStyle(buttonRow);

    expect(buttonRowStyle.visibility).toBe('hidden');
    expect(firstNameInput).toBeFalsy();
    expect(lastNameInput).toBeFalsy();
    expect(genderInput).toBeFalsy();
    expect(symptomsInput).toBeFalsy();
  })
  it('should display button and editable fields when edit mode is called', async () => {
    let showToggler = fixture.debugElement.nativeElement.querySelector('#showEditOption')
    let dropdownMenuItem = fixture.debugElement.nativeElement.querySelector('#dropdown-menu-item')
    let buttonRow = fixture.debugElement.nativeElement.querySelector('#button-row')

    showToggler.click()
    dropdownMenuItem.click()

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let buttonRowStyle = getComputedStyle(buttonRow);
      let firstNameInput = fixture.debugElement.nativeElement.querySelector('#firstNameInput')
      let lastNameInput = fixture.debugElement.nativeElement.querySelector('#lastNameInput')
      let genderInput = fixture.debugElement.nativeElement.querySelector('#editableGender')
      let symptomsInput = fixture.debugElement.nativeElement.querySelector('#multipleSelectEdit')

      expect(buttonRowStyle.visibility).toBe('visible');
      expect(firstNameInput).toBeTruthy();
      expect(lastNameInput).toBeTruthy();
      expect(genderInput).toBeTruthy();
      expect(symptomsInput).toBeTruthy();
    })
  })

  it('should submit data and update user record successfully if all fields are completed', async () => {
    let showToggler = fixture.debugElement.nativeElement.querySelector('#showEditOption')
    let dropdownMenuItem = fixture.debugElement.nativeElement.querySelector('#dropdown-menu-item')

    showToggler.click()
    dropdownMenuItem.click()

    fixture.whenStable().then(() => {
      fixture.detectChanges()
      let button = fixture.debugElement.nativeElement.querySelector('#clickButton')
      spyOn(component, 'submitData');
      button.click();

      expect(component.submitData).toHaveBeenCalled();
      expect(component.selectedUser).toEqual(component.formData);
    })
  })

  it('should disable button and show validation error message if any editable field is empty', async () => {
    let showToggler = fixture.debugElement.nativeElement.querySelector('#showEditOption')
    let dropdownMenuItem = fixture.debugElement.nativeElement.querySelector('#dropdown-menu-item')

    showToggler.click()
    dropdownMenuItem.click()

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let firstNameInput = fixture.debugElement.nativeElement.querySelector('#firstNameInput')
      let button = fixture.debugElement.nativeElement.querySelector('#clickButton')

      firstNameInput.value = '';
      firstNameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges()
      let firstNameInputError = fixture.debugElement.nativeElement.querySelector('#firstNameError')

      expect(button.disabled).toBeTruthy();
      expect(firstNameInputError).toBeTruthy();
      expect(firstNameInputError.innerText).toContain('First Name is required');
    })
  })
});

