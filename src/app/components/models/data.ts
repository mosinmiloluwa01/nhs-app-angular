export interface UserModel {
  id: number;
  gender: GenderObjectModel;
  firstName: string;
  lastName: string;
  symptoms: Array<SymptomsObjectModel>;
  [propName: string]: any;
}

export interface SymptomsObjectModel {
  id: number;
  name: string;
  [propName: string]: any;
}
export interface GenderObjectModel {
  id: number;
  name: string;
}