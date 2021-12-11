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
    let firstName = fixture.debugElement.nativeElement.querySelector('#firstName')
    let lastName = fixture.debugElement.nativeElement.querySelector('#lastName')
    let gender = fixture.debugElement.nativeElement.querySelector('#gender')
    let symptoms = fixture.debugElement.nativeElement.querySelector('#multipleSelect')
    let editButton = fixture.debugElement.nativeElement.querySelector('#clickButton')

    expect(firstName.innerText).toContain('James');
    expect(lastName.innerText).toContain('Blunt');
    expect(gender.innerText).toContain('Male');
    expect(symptoms.innerText).toContain('Headache');
    expect(editButton).toBeFalsy();
  })
  it('should not display button when edit mode is not called', () => {
    let editButton = fixture.debugElement.nativeElement.querySelector('#clickButton')

    expect(editButton).toBeFalsy();
  })
  it('should display button when edit mode is called', () => {
    spyOn(component, 'toggleDropdown')
    spyOn(component, 'setEditMode')

    let showToggler = fixture.debugElement.nativeElement.querySelector('#showEditOption')
    showToggler.click()

    expect(component.toggleDropdown).toHaveBeenCalled();
  })
});

