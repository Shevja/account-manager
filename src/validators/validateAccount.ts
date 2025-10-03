import {type Account, RecordTypes} from "@/models/accounts.ts";

export interface AccountValidationErrors {
    login?: boolean;
    password?: boolean;
}

export function validateAccount(account: Account): AccountValidationErrors {
    // Проверка что логин и пароль:
    // 1. не пустые
    // 2. их длина не больше 100 символов
    // 3. тип аккаунта не LDAP (для пароля)
    const errors: AccountValidationErrors = {};

    errors.login = !account.login || account.login.length > 100
    errors.password = account.recordType === RecordTypes.Local && (!account.password || account.password.length > 100)

    return errors
}