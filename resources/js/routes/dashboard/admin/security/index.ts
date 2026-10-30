import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::whitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
export const whitelist = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: whitelist.url(options),
    method: 'post',
})

whitelist.definition = {
    methods: ["post"],
    url: '/dashboard/admin/security/whitelist',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::whitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
whitelist.url = (options?: RouteQueryOptions) => {




    return whitelist.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::whitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
whitelist.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: whitelist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::whitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
const whitelistForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: whitelist.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::whitelist
* @see app/Http/Controllers/AdminController.php:421
* @route '/dashboard/admin/security/whitelist'
*/
whitelistForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: whitelist.url(options),
    method: 'post',
})

whitelist.form = whitelistForm

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
export const backup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backup.url(options),
    method: 'get',
})

backup.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/security/backup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
backup.url = (options?: RouteQueryOptions) => {




    return backup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
backup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
backup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: backup.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
const backupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
backupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::backup
* @see app/Http/Controllers/AdminController.php:443
* @route '/dashboard/admin/security/backup'
*/
backupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backup.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

backup.form = backupForm



const security = {
    whitelist: Object.assign(whitelist, whitelist),
    backup: Object.assign(backup, backup),
}

export default security