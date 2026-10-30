import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AlertController::ack
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
export const ack = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ack.url(args, options),
    method: 'post',
})

ack.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/{id}/ack',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::ack
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
ack.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ack.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::ack
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
ack.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::ack
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
const ackForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ack.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::ack
* @see app/Http/Controllers/AlertController.php:55
* @route '/dashboard/alerts/{id}/ack'
*/
ackForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ack.url(args, options),
    method: 'post',
})

ack.form = ackForm

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
* @see \App\Http\Controllers\AlertController::thresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
export const thresholds = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: thresholds.url(options),
    method: 'post',
})

thresholds.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/thresholds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AlertController::thresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
thresholds.url = (options?: RouteQueryOptions) => {




    return thresholds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AlertController::thresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
thresholds.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: thresholds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::thresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
const thresholdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: thresholds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AlertController::thresholds
* @see app/Http/Controllers/AlertController.php:102
* @route '/dashboard/alerts/thresholds'
*/
thresholdsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: thresholds.url(options),
    method: 'post',
})

thresholds.form = thresholdsForm



const alerts = {
    ack: Object.assign(ack, ack),
    resolve: Object.assign(resolve, resolve),
    thresholds: Object.assign(thresholds, thresholds),
}

export default alerts