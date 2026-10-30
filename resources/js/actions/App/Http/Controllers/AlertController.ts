import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard/alerts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
index.url = (options?: RouteQueryOptions) => {




    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AlertController::index
* @see app/Http/Controllers/AlertController.php:18
* @route '/dashboard/alerts'
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
* @see \App\Http\Controllers\AlertController::acknowledge
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
export const acknowledge = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/{id}/ack',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::acknowledge
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
acknowledge.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return acknowledge.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::acknowledge
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
acknowledge.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::acknowledge
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
const acknowledgeForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::acknowledge
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
acknowledgeForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, options),
    method: 'post',
})

acknowledge.form = acknowledgeForm

/**
* @see \App\Http\Controllers\AlertController::resolve
* @see app/Http/Controllers/AlertController.php:75
* @route '/dashboard/alerts/{id}/resolve'
*/
export const resolve = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/{id}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::resolve
* @see app/Http/Controllers/AlertController.php:75
* @route '/dashboard/alerts/{id}/resolve'
*/
resolve.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return resolve.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::resolve
* @see app/Http/Controllers/AlertController.php:75
* @route '/dashboard/alerts/{id}/resolve'
*/
resolve.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::resolve
* @see app/Http/Controllers/AlertController.php:75
* @route '/dashboard/alerts/{id}/resolve'
*/
const resolveForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::resolve
* @see app/Http/Controllers/AlertController.php:75
* @route '/dashboard/alerts/{id}/resolve'
*/
resolveForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\AlertController::updateThresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
export const updateThresholds = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateThresholds.url(options),
    method: 'post',
})

updateThresholds.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/thresholds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::updateThresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
updateThresholds.url = (options?: RouteQueryOptions) => {




    return updateThresholds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::updateThresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
updateThresholds.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateThresholds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::updateThresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
const updateThresholdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateThresholds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::updateThresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
updateThresholdsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateThresholds.url(options),
    method: 'post',
})

updateThresholds.form = updateThresholdsForm

const AlertController = { index, acknowledge, resolve, updateThresholds }

export default AlertController