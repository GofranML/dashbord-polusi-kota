import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
export const latest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

latest.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/latest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
latest.url = (options?: RouteQueryOptions) => {




    return latest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
latest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
latest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: latest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
const latestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
latestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::latest
* @see app/Http/Controllers/Api/DashboardController.php:13
* @route '/api/dashboard/latest'
*/
latestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

latest.form = latestForm

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
history.url = (options?: RouteQueryOptions) => {




    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::history
* @see app/Http/Controllers/Api/DashboardController.php:36
* @route '/api/dashboard/history'
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
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
export const allHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allHistory.url(options),
    method: 'get',
})

allHistory.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/history/all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
allHistory.url = (options?: RouteQueryOptions) => {




    return allHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
allHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allHistory.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
allHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allHistory.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
const allHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allHistory.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
allHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allHistory.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::allHistory
* @see app/Http/Controllers/Api/DashboardController.php:109
* @route '/api/dashboard/history/all'
*/
allHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allHistory.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

allHistory.form = allHistoryForm

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
statistics.url = (options?: RouteQueryOptions) => {




    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::statistics
* @see app/Http/Controllers/Api/DashboardController.php:59
* @route '/api/dashboard/statistics'
*/
statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statistics.form = statisticsForm

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
export const devices = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devices.url(options),
    method: 'get',
})

devices.definition = {
    methods: ["get","head"],
    url: '/api/devices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
devices.url = (options?: RouteQueryOptions) => {




    return devices.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
devices.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
devices.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devices.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
const devicesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
*/
devicesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: devices.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\DashboardController::devices
* @see app/Http/Controllers/Api/DashboardController.php:83
* @route '/api/devices'
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

const DashboardController = { latest, history, allHistory, statistics, devices }

export default DashboardController