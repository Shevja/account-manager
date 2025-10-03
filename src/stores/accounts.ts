import {defineStore} from 'pinia'
import {type Account, RecordTypes} from "@/models/accounts.ts";
import {useLocalStorage} from "@/composables/useLocalStorage.ts";

export const useAccountsStore = defineStore('accounts', {
    state: () => {
        return {
            accounts: useLocalStorage<Account[]>('accounts', []),
        }
    },

    actions: {
        addAccount() {
            // Берем последний известный id, и добавляем 1
            // если список пуст то задаем 0
            const last = this.accounts[this.accounts.length - 1];
            const nextId = last ? last.id + 1 : 0

            const newAccount: Account = {
                id: nextId,
                login: '',
                password: '',
                tags: [],
                recordType: RecordTypes.Local,
            }

            this.accounts.push(newAccount)
        },
        saveAccount(account: Account) {
            const accountIndex = this.accounts.findIndex(acc => acc.id === account.id)

            accountIndex !== -1
                ? this.accounts[accountIndex] = account
                : this.accounts.push(account)

            console.log('save account', account)
        },
        removeAccount(id: number) {
            const accountIndex = this.accounts.findIndex(account => account.id === id)
            if (accountIndex !== -1) this.accounts.splice(accountIndex, 1)
        },
        updateRecordType(account: Account) {
            if (account.recordType === RecordTypes.LDAP) {
                account.password = null;
            } else {
                account.password = '';
            }

            this.saveAccount(account)
        }
    }
})