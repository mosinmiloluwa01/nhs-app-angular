import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GenderObjectModel, SymptomsObjectModel, UserModel } from '../../models/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = 'Doc-Monitor';
  showHamburger: boolean = false;
  showDropdown: boolean = false;
  isEditMode: boolean = false;
  isProcessing: boolean = false;
  isLoading: boolean = true;
  showUserList: boolean = true;
  showUserDetails: boolean = true;
  users!: Array<UserModel>;
  selectedUser!: UserModel;
  formData!: any;
  genderArray!: Array<GenderObjectModel>
  symptomsArray!: Array<SymptomsObjectModel>
  symptomIdArray: Array<number> = []
  deviceType!: string
  filter: string = ''

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.fetchUsers()
    this.fetchGenders()
    this.fetchSymptoms()
  }

  fetchGenders() {
    this.dataService.getAllGenders().subscribe((data: Array<GenderObjectModel>) => {
      this.genderArray = data
    })
  }

  fetchSymptoms() {
    this.dataService.getAllSymptoms().subscribe((data: Array<SymptomsObjectModel>) => {
      this.symptomsArray = data
      this.isLoading = false;
      this.getResponsiveMeasurment();
      this.setDeviceType()
    })
  }

  fetchUsers() {
    this.dataService.getAllUsers().subscribe((data: Array<UserModel>) => {
      this.users = data;
      this.selectedUser = this.users[0];
      this.selectedUser.symptoms.map((user: SymptomsObjectModel) => {
        this.symptomIdArray.push(user.id)
      })
      this.formData = this.selectedUser
    })
  }

  setSelectedUser(index: number) {
    this.selectedUser = this.users[index]
    let data = this.selectedUser
    this.formData = data
    if (this.deviceType == 'desktop' || this.deviceType == 'largeTab') {
      this.showUserDetails = true
      this.showUserList = true
    }
    if (this.deviceType == 'mobile') {
      this.showUserList = false
      this.showUserDetails = true
      this.setDivDimensions()
      // this.showContent()
    }
    if (this.deviceType == 'miniTab') {
      this.showUserList = true
      this.showUserDetails = true
      this.setDivDimensions()
    }
  }

  setDeviceType() {
    if (window.innerWidth >= 1366 && window.innerHeight <= 1000) {
      this.utilsService.setCurrentDeviceType('desktop')
    }
    if (window.innerWidth >= 1025 && window.innerWidth <= 1366 && window.innerHeight > 1000) {
      this.utilsService.setCurrentDeviceType('largeTab')
    }
    if (window.innerWidth >= 700 && window.innerWidth <= 1024) {
      this.utilsService.setCurrentDeviceType('miniTab')
    }
    if (window.innerWidth <= 699) {
      this.utilsService.setCurrentDeviceType('mobile')
    }
  }

  getResponsiveMeasurment() {
    this.utilsService.currentDeviceType.subscribe(data => {
      this.deviceType = data
      console.log('devicetype>>', this.deviceType)
      this.showContent()
    })
  }

  showContent(type = '') {
    if (this.deviceType == 'desktop' || this.deviceType == 'largeTab') {
      this.showUserDetails = true
      this.showUserList = true
    }
    if (this.deviceType == 'mobile') {
      this.showUserList = true
      this.showUserDetails = false
      this.setDivDimensions()
    }
    if (this.deviceType == 'miniTab') {
      this.showUserList = true
      this.showUserDetails = true
      this.setDivDimensions()
    }
  }

  setDivDimensions() {
    if (this.deviceType == 'mobile' && this.showUserList) {
      let documents: any
      documents = document
      documents.getElementById("user-list").style.width = "100%";
    }
    // if (this.deviceType == 'miniTab' && this.showUserList) {
    //   let documents: any
    //   documents = document
    //   documents.getElementById("user-list").style.width = "100%";
    // }
  }

  checkNumber(input: string) {
    if (/\d/.test(input)) { }
    return /\d/.test(input);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown
    console.log('toggledropdown called>>', this.showDropdown)
  }

  setEditMode() {
    this.isEditMode = true
    this.toggleDropdown()
    console.log('seteditmode called>>', this.showDropdown)
  }

  setSelectedGender(data: any) {
    this.formData.gender = this.genderArray.find((gender: any) => gender.id == data.target.value)
  }

  setSelectedSymptoms(data: SymptomsObjectModel) {
    if (this.symptomIdArray.includes(data.id)) {
      this.formData.symptoms = this.formData.symptoms.filter((symptom: SymptomsObjectModel) => symptom.id !== data.id)
      this.symptomIdArray = this.symptomIdArray.filter((id: number) => id !== data.id)
      return
    }
    this.formData.symptoms.push(data)
    this.symptomIdArray.push(data.id)
  }

  submitData() {
    this.isProcessing = true;
    this.dataService.editUser(this.formData).subscribe((data: any) => {
      console.log('data from submit>>>', data)
      this.isProcessing = false
      this.selectedUser = this.formData;
      this.isEditMode = false;
    }, error => {
      this.isProcessing = false
    })
  }

  goBack() {
    this.showUserList = true;
    this.showUserDetails = false;
  }

  search() {
    var li: any, txtValue;
    li = document.getElementsByClassName('item-row');
    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < li.length; i++) {
      txtValue = li[i].innerText.toUpperCase();
      if (txtValue.includes(this.filter.toUpperCase())) {
        li[i].parentNode.style.setProperty('display', 'flex', 'important');
        console.log('textvalue>>>', li[i].innerText.toUpperCase(), txtValue.includes(this.filter.toUpperCase()))
      } else {
        li[i].parentNode.style.setProperty('display', 'none', 'important');
      }
    }
  }

}
