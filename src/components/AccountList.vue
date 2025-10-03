<script setup lang="ts">
import {Button, Column, DataTable, InputText, Message, Select, Textarea} from "primevue";
import {reactive} from "vue";
import {useAccountsStore} from "@/stores/accounts.ts";
import {parseTags, stringifyTags} from "@/utils/tags.ts";
import {type Account, type RecordType, RecordTypes} from "@/models/accounts"
import {type AccountValidationErrors, validateAccount} from "@/validators/validateAccount.ts";

const accountsStore = useAccountsStore()
const errors = reactive<Record<number, AccountValidationErrors>>({})

const recordTypes: RecordType[] = [
    {label: 'Локальная', value: RecordTypes.Local},
    {label: 'LDAP', value: RecordTypes.LDAP},
];

function onRemoveAccount(id: number) {
    delete errors[id]
    accountsStore.removeAccount(id)
}

function onRecordTypeChange(account: Account) {
    accountsStore.updateRecordType(account)
    onAccountChange(account)
}

function onAccountChange(account: Account) {
    const validation = validateAccount(account)
    errors[account.id] = validation;

    if (Object.keys(validation).length === 0) {
        accountsStore.saveAccount(account)
    }
}
</script>

<template>
    <section class="py-10">
        <div class="container mx-auto">

            <div class="flex gap-4 items-center mb-3">
                <h2 class="text-xl font-semibold">Учетные записи</h2>
                <Button icon="pi pi-plus" aria-label="Save" variant="outlined" @click="accountsStore.addAccount"/>
            </div>

            <Message class="mb-4" severity="secondary">
                <div class="flex gap-2">
                    <span class="pi pi-question-circle !text-xl"/>
                    <span>
                        Для указания нескольких меток для одной пары
                        логин/пароль используйте раделитель ;
                    </span>
                </div>
            </Message>

            <DataTable
                :value="accountsStore.accounts"
                :rows="5"
                :rows-per-page-options="[5, 10, 20]"
                size="small"
                dataKey="id"
                paginator
            >
                <template #empty>
                    <div class="text-center">Список пуст</div>
                </template>
                <template #loading>
                    <div>Данные загружаются</div>
                </template>

                <!--Метки-->
                <Column field="tags" header="Метки">
                    <template #body="slotProps">
                        <Textarea
                            :model-value="stringifyTags(slotProps.data.tags)"
                            @update:model-value="val => slotProps.data.tags = parseTags(val)"
                            autoResize
                            rows="1"
                            class="w-full"
                            placeholder="Метки"
                            maxlength="50"
                            @blur="onAccountChange(slotProps.data)"
                        />
                    </template>
                </Column>

                <!-- Тип записи -->
                <Column field="record_type" header="Тип записи">
                    <template #body="slotProps">
                        <Select
                            v-model="slotProps.data.recordType"
                            :options="recordTypes"
                            optionLabel="label"
                            optionValue="value"
                            class="w-full"
                            placeholder="Тип записи"
                            @change="onRecordTypeChange(slotProps.data)"
                        />
                    </template>
                </Column>

                <!-- Логин -->
                <Column field="login" header="Логин">
                    <template #body="slotProps">
                        <InputText
                            v-model="slotProps.data.login"
                            class="w-full"
                            placeholder="Логин"
                            required
                            :invalid="errors[slotProps.data.id]?.login"
                            @blur="onAccountChange(slotProps.data)"
                        />
                    </template>
                </Column>

                <!-- Пароль, если не LDAP -->
                <Column
                    field="password"
                    header="Пароль"
                >
                    <template #body="slotProps">
                        <InputText
                            v-if="slotProps.data.recordType !== 'LDAP'"
                            v-model="slotProps.data.password"
                            class="w-full"
                            placeholder="Пароль"
                            required
                            :invalid="errors[slotProps.data.id]?.password"
                            @blur="onAccountChange(slotProps.data)"
                        />
                    </template>
                </Column>

                <!-- Кнопка удаления записи -->
                <Column>
                    <template #body="slotProps">
                        <Button
                            icon="pi pi-trash"
                            variant="link"
                            @click="onRemoveAccount(slotProps.data.id)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
</template>
