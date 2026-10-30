import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import exportMethod from './export'
import alerts080c72 from './alerts'
import technician from './technician'
import admin from './admin'
/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/dashboard/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
history.url = (options?: RouteQueryOptions) => {




    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::history
* @see app/Http/Controllers/TelemetryController.php:288
* @route '/dashboard/history'
*/
historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

history.form = historyForm

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
export const alerts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alerts.url(options),
    method: 'get',
})

alerts.definition = {
    methods: ["get","head"],
    url: '/dashboard/alerts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
alerts.url = (options?: RouteQueryOptions) => {




    return alerts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
alerts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
alerts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alerts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
const alertsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
alertsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::alerts
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
alertsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alerts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

alerts.form = alertsForm



const dashboard = {
    history: Object.assign(history, history),
    export: Object.assign(exportMethod, exportMethod),
    alerts: Object.assign(alerts, alerts080c72),
    technician: Object.assign(technician, technician),
    admin: Object.assign(admin, admin),
}

export default dashboard