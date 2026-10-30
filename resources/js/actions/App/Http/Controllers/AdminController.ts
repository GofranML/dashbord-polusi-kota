import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
users.url = (options?: RouteQueryOptions) => {




    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/dashboard/admin/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

/**
* @see \App\Http\Controllers\AdminController::storeUser
* @see app/Http/Controllers/AdminController.php:58
* @route '/dashboard/admin/users'
*/
export const storeUser = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

storeUser.definition = {
    methods: ["post"],
    url: '/dashboard/admin/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeUser
* @see app/Http/Controllers/AdminController.php:58
* @route '/dashboard/admin/users'
*/
storeUser.url = (options?: RouteQueryOptions) => {




    return storeUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeUser
* @see app/Http/Controllers/AdminController.php:58
* @route '/dashboard/admin/users'
*/
storeUser.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeUser.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeUser
* @see app/Http/Controllers/AdminController.php:58
* @route '/dashboard/admin/users'
*/
const storeUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeUser.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeUser
* @see app/Http/Controllers/AdminController.php:58
* @route '/dashboard/admin/users'
*/
storeUserForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeUser.url(options),
    method: 'post',
})

storeUser.form = storeUserForm

/**
* @see \App\Http\Controllers\AdminController::updateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/dashboard/admin/users/{id}/update'
*/
export const updateUser = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateUser.url(args, options),
    method: 'post',
})

updateUser.definition = {
    methods: ["post"],
    url: '/dashboard/admin/users/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/dashboard/admin/users/{id}/update'
*/
updateUser.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }


    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)


    const parsedArgs = {
        id: args.id,
    }

    return updateUser.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/dashboard/admin/users/{id}/update'
*/
updateUser.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/dashboard/admin/users/{id}/update'
*/
const updateUserForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/dashboard/admin/users/{id}/update'
*/
updateUserForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUser.url(args, options),
    method: 'post',
})

updateUser.form = updateUserForm

/**
* @see \App\Http\Controllers\AdminController::destroyUser
* @see app/Http/Controllers/AdminController.php:135
* @route '/dashboard/admin/users/{id}'
*/
export const destroyUser = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyUser.url(args, options),
    method: 'delete',
})

destroyUser.definition = {
    methods: ["delete"],
    url: '/dashboard/admin/users/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::destroyUser
* @see app/Http/Controllers/AdminController.php:135
* @route '/dashboard/admin/users/{id}'
*/
destroyUser.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }


    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)


    const parsedArgs = {
        id: args.id,
    }

    return destroyUser.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::destroyUser
* @see app/Http/Controllers/AdminController.php:135
* @route '/dashboard/admin/users/{id}'
*/
destroyUser.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyUser.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::destroyUser
* @see app/Http/Controllers/AdminController.php:135
* @route '/dashboard/admin/users/{id}'
*/
const destroyUserForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::destroyUser
* @see app/Http/Controllers/AdminController.php:135
* @route '/dashboard/admin/users/{id}'
*/
destroyUserForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyUser.form = destroyUserForm

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
export const config = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: config.url(options),
    method: 'get',
})

config.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/config',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
config.url = (options?: RouteQueryOptions) => {




    return config.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
config.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
config.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: config.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
const configForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
configForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::config
* @see app/Http/Controllers/AdminController.php:161
* @route '/dashboard/admin/config'
*/
configForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

config.form = configForm

/**
* @see \App\Http\Controllers\AdminController::updateConfig
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
export const updateConfig = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConfig.url(options),
    method: 'post',
})

updateConfig.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateConfig
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
updateConfig.url = (options?: RouteQueryOptions) => {




    return updateConfig.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateConfig
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
updateConfig.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConfig.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConfig
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
const updateConfigForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConfig.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConfig
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
updateConfigForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConfig.url(options),
    method: 'post',
})

updateConfig.form = updateConfigForm

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
export const sendTelemetry = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTelemetry.url(options),
    method: 'post',
})

sendTelemetry.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config/send-telemetry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetry.url = (options?: RouteQueryOptions) => {




    return sendTelemetry.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetry.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTelemetry.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
const sendTelemetryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendTelemetry.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendTelemetry.url(options),
    method: 'post',
})

sendTelemetry.form = sendTelemetryForm

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
export const detectTelegramChat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectTelegramChat.url(options),
    method: 'post',
})

detectTelegramChat.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config/detect-telegram-chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChat.url = (options?: RouteQueryOptions) => {




    return detectTelegramChat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectTelegramChat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
const detectTelegramChatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: detectTelegramChat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: detectTelegramChat.url(options),
    method: 'post',
})

detectTelegramChat.form = detectTelegramChatForm

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
export const security = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: security.url(options),
    method: 'get',
})

security.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/security',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
security.url = (options?: RouteQueryOptions) => {




    return security.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
security.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: security.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
security.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: security.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
const securityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: security.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
securityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: security.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::security
* @see app/Http/Controllers/AdminController.php:393
* @route '/dashboard/admin/security'
*/
securityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: security.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

security.form = securityForm

/**
* @see \App\Http\Controllers\AdminController::updateIpWhitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
export const updateIpWhitelist = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateIpWhitelist.url(options),
    method: 'post',
})

updateIpWhitelist.definition = {
    methods: ["post"],
    url: '/dashboard/admin/security/whitelist',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateIpWhitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
updateIpWhitelist.url = (options?: RouteQueryOptions) => {




    return updateIpWhitelist.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateIpWhitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
updateIpWhitelist.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateIpWhitelist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateIpWhitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
const updateIpWhitelistForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateIpWhitelist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateIpWhitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
updateIpWhitelistForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateIpWhitelist.url(options),
    method: 'post',
})

updateIpWhitelist.form = updateIpWhitelistForm

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
export const downloadBackup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(options),
    method: 'get',
})

downloadBackup.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/security/backup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
downloadBackup.url = (options?: RouteQueryOptions) => {




    return downloadBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
downloadBackup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
downloadBackup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBackup.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
const downloadBackupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBackup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
downloadBackupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBackup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::downloadBackup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
downloadBackupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBackup.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadBackup.form = downloadBackupForm

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
export const apiDocs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiDocs.url(options),
    method: 'get',
})

apiDocs.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/api-docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
apiDocs.url = (options?: RouteQueryOptions) => {




    return apiDocs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
apiDocs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiDocs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
apiDocs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiDocs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
const apiDocsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiDocs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
apiDocsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiDocs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::apiDocs
* @see app/Http/Controllers/AdminController.php:465
* @route '/dashboard/admin/api-docs'
*/
apiDocsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiDocs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

apiDocs.form = apiDocsForm

const AdminController = { users, storeUser, updateUser, destroyUser, config, updateConfig, sendTelemetry, detectTelegramChat, security, updateIpWhitelist, downloadBackup, apiDocs }

export default AdminController