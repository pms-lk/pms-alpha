export namespace API {
  /**
   * Default response format used in API
   *
   * @export
   * @interface Response
   */
  export interface Response<T = any> {
    success: boolean;
    err?: string;
    data?: T;
  }
  export namespace Auth {
    /**
     * Data passing with the jwt
     *
     * @export
     * @interface UserData
     */
    export interface UserData {
      id: number;
      fname: string;
      lname: string;
      username: string;
    }

    /**
     * Return type when the backend successfully executed the
     * username & password checking (no matter password is
     * correct or incorrect)
     *
     * @export
     * @interface LoginResponse
     */
    export interface LoginResponse {
      user: UserData;
      access: string;
      refresh: string;
    }
  }

  export namespace Patient {
    /**
     * Basic data gathered from the patient
     *
     * @export
     * @interface BasicDetails
     */
    export interface BasicDetails {
      firstname: string;
      lastname: string;
      dob?: Date;
      gender: "male" | "female" | "other";
      marital: "married" | "unmarried";
      address: string;
      grama_niladhari?: string;
      divisional_sector?: string;
      contact_number: number;
      phi_tp?: number;
      moh_tp?: number;
      living_with: string;
      lw_name?: string;
      lw_address?: string;
      lw_tp?: number;
      edu_status?: string[];
      has_job: boolean;
      job?: string;
      gov_facilities?: string;
      diseases: string;
      treatment_his?: string[];
      last_clinic_visit?: Date;
      informed_over_phone?: Date;
      home_visit?: Date;
      next_clinic_date?: Date;
      hospital_admission: string;
      [key: string]: BasicDetails[keyof BasicDetails];
    }
  }
}