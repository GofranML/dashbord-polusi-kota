import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:43
* @route '/dashboard/admin/devices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dashboard/admin/devices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:43
* @route '/dashboard/admin/devices'
*/
store.url = (options?: RouteQueryOptions) => {




    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:43
* @route '/dashboard/admin/devices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:43
* @route '/dashboard/admin/devices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::store
* @see app/Http/Controllers/DeviceController.php:43
* @route '/dashboard/admin/devices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:79
* @route '/dashboard/admin/devices/{id}/update'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/dashboard/admin/devices/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:79
* @route '/dashboard/admin/devices/{id}/update'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:79
* @route '/dashboard/admin/devices/{id}/update'
*/
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:79
* @route '/dashboard/admin/devices/{id}/update'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::update
* @see app/Http/Controllers/DeviceController.php:79
* @route '/dashboard/admin/devices/{id}/update'
*/
updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\DeviceController::deleteMethod
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
export const deleteMethod = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/dashboard/admin/devices/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DeviceController::deleteMethod
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
deleteMethod.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::deleteMethod
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
deleteMethod.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DeviceController::deleteMethod
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
const deleteMethodForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::deleteMethod
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
deleteMethodForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

/**
* @see \App\Http\Controllers\DeviceController::token
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
export const token = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: token.url(args, options),
    method: 'post',
})

token.definition = {
    methods: ["post"],
    url: '/dashboard/admin/devices/{id}/token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::token
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
token.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return token.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::token
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
token.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: token.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::token
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
const tokenForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: token.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::token
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
tokenForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: token.url(args, options),
    method: 'post',
})

token.form = tokenForm



const devices = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    delete: Object.assign(deleteMethod, deleteMethod),
    token: Object.assign(token, token),
}

export default devices