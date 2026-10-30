import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
export const welcome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

welcome.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
welcome.url = (options?: RouteQueryOptions) => {




    return welcome.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
welcome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
welcome.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: welcome.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
const welcomeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
welcomeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::welcome
* @see app/Http/Controllers/TelemetryController.php:26
* @route '/'
*/
welcomeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: welcome.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

welcome.form = welcomeForm

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
export const maps = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maps.url(options),
    method: 'get',
})

maps.definition = {
    methods: ["get","head"],
    url: '/maps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
maps.url = (options?: RouteQueryOptions) => {




    return maps.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
maps.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maps.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
maps.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: maps.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
const mapsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: maps.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
mapsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: maps.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::maps
* @see app/Http/Controllers/TelemetryController.php:237
* @route '/maps'
*/
mapsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: maps.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

maps.form = mapsForm

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
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
export const exportCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

exportCsv.definition = {
    methods: ["get","head"],
    url: '/dashboard/export/csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
exportCsv.url = (options?: RouteQueryOptions) => {




    return exportCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
exportCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
exportCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportCsv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
const exportCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
exportCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportCsv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
exportCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportCsv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportCsv.form = exportCsvForm

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/dashboard/export/excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
exportExcel.url = (options?: RouteQueryOptions) => {




    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::exportExcel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
exportExcelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportExcel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportExcel.form = exportExcelForm

const TelemetryController = { welcome, maps, history, exportCsv, exportExcel }

export default TelemetryController