import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import users48860f from './users'
import devices95ecd0 from './devices'
import config8555dc from './config'
import security176da1 from './security'
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
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
export const devices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devices.url(options),
    method: 'get',
})

devices.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
devices.url = (options?: RouteQueryOptions) => {




    return devices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
devices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
devices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devices.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
const devicesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
devicesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::devices
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
devicesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: devices.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

devices.form = devicesForm

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



const admin = {
    users: Object.assign(users, users48860f),
    devices: Object.assign(devices, devices95ecd0),
    config: Object.assign(config, config8555dc),
    security: Object.assign(security, security176da1),
    apiDocs: Object.assign(apiDocs, apiDocs),
}

export default admin