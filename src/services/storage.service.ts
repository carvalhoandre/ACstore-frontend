import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { LocalUser } from "../models/local_user";

@Injectable()
export class StorageService{

    getLocalUser() : LocalUser{
        let usr = localStorage.getItem(STORAGE_KEYS.localUSer)
        if (usr == null) {
            return null
        }
        else {
            return JSON.parse(usr);
        }
    }

    setLocalUser(obj : LocalUser) {
        if(obj == null) {
            localStorage.removeItem(STORAGE_KEYS.localUSer);
        }
        else{
            localStorage.setItem(STORAGE_KEYS.localUSer, JSON.stringify(obj));
        }

    }

}