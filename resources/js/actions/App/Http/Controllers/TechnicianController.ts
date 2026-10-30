import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
export const tickets = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tickets.url(options),
    method: 'get',
})

tickets.definition = {
    methods: ["get","head"],
    url: '/dashboard/technician/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
tickets.url = (options?: RouteQueryOptions) => {




    return tickets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
tickets.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tickets.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
tickets.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tickets.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
const ticketsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tickets.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
ticketsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tickets.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::tickets
* @see app/Http/Controllers/TechnicianController.php:19
* @route '/dashboard/technician/tickets'
*/
ticketsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tickets.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tickets.form = ticketsForm

/**
* @see \App\Http\Controllers\TechnicianController::storeTicket
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
export const storeTicket = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTicket.url(options),
    method: 'post',
})

storeTicket.definition = {
    methods: ["post"],
    url: '/dashboard/technician/tickets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TechnicianController::storeTicket
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
storeTicket.url = (options?: RouteQueryOptions) => {




    return storeTicket.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::storeTicket
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
storeTicket.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTicket.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::storeTicket
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
const storeTicketForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTicket.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::storeTicket
* @see app/Http/Controllers/TechnicianController.php:51
* @route '/dashboard/technician/tickets'
*/
storeTicketForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTicket.url(options),
    method: 'post',
})

storeTicket.form = storeTicketForm

/**
* @see \App\Http\Controllers\TechnicianController::updateTicket
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
export const updateTicket = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTicket.url(args, options),
    method: 'post',
})

updateTicket.definition = {
    methods: ["post"],
    url: '/dashboard/technician/tickets/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TechnicianController::updateTicket
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
updateTicket.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateTicket.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::updateTicket
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
updateTicket.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTicket.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::updateTicket
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
const updateTicketForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTicket.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TechnicianController::updateTicket
* @see app/Http/Controllers/TechnicianController.php:86
* @route '/dashboard/technician/tickets/{id}/update'
*/
updateTicketForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTicket.url(args, options),
    method: 'post',
})

updateTicket.form = updateTicketForm

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
export const health = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

health.definition = {
    methods: ["get","head"],
    url: '/dashboard/technician/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
health.url = (options?: RouteQueryOptions) => {




    return health.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
health.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
health.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: health.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
const healthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
healthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TechnicianController::health
* @see app/Http/Controllers/TechnicianController.php:122
* @route '/dashboard/technician/health'
*/
healthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: health.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

health.form = healthForm

const TechnicianController = { tickets, storeTicket, updateTicket, health }

export default TechnicianController