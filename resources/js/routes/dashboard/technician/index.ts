import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import tickets3ee395 from './tickets'
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



const technician = {
    tickets: Object.assign(tickets, tickets3ee395),
    health: Object.assign(health, health),
}

export default technician