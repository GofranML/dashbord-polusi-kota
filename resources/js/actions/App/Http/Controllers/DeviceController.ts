import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard/admin/devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
index.url = (options?: RouteQueryOptions) => {




    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DeviceController::index
* @see app/Http/Controllers/DeviceController.php:17
* @route '/dashboard/admin/devices'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

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
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/dashboard/admin/devices/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::destroy
* @see app/Http/Controllers/DeviceController.php:113
* @route '/dashboard/admin/devices/{id}'
*/
destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\DeviceController::generateToken
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
export const generateToken = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateToken.url(args, options),
    method: 'post',
})

generateToken.definition = {
    methods: ["post"],
    url: '/dashboard/admin/devices/{id}/token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeviceController::generateToken
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
generateToken.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return generateToken.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeviceController::generateToken
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
generateToken.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateToken.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::generateToken
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
const generateTokenForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateToken.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeviceController::generateToken
* @see app/Http/Controllers/DeviceController.php:134
* @route '/dashboard/admin/devices/{id}/token'
*/
generateTokenForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateToken.url(args, options),
    method: 'post',
})

generateToken.form = generateTokenForm

const DeviceController = { index, store, update, destroy, generateToken }

export default DeviceController