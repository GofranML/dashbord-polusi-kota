import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dashboard/technician/tickets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
store.url = (options?: RouteQueryOptions) => {




    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::store
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/dashboard/technician/tickets/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
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
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::update
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm



const tickets = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
}

export default tickets