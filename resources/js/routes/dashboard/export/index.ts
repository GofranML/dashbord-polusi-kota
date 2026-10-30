import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
export const csv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csv.url(options),
    method: 'get',
})

csv.definition = {
    methods: ["get","head"],
    url: '/dashboard/export/csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
csv.url = (options?: RouteQueryOptions) => {




    return csv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
csv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: csv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
csv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: csv.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
const csvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
csvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csv.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::csv
* @see app/Http/Controllers/TelemetryController.php:331
* @route '/dashboard/export/csv'
*/
csvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: csv.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

csv.form = csvForm

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
export const excel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

excel.definition = {
    methods: ["get","head"],
    url: '/dashboard/export/excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
excel.url = (options?: RouteQueryOptions) => {




    return excel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
excel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
excel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: excel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
const excelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
excelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TelemetryController::excel
* @see app/Http/Controllers/TelemetryController.php:380
* @route '/dashboard/export/excel'
*/
excelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: excel.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

excel.form = excelForm



const exportMethod = {
    csv: Object.assign(csv, csv),
    excel: Object.assign(excel, excel),
}

export default exportMethod