import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\IotDataController::upload
* @see app/Http/Controllers/Api/IotDataController.php:18
* @route '/api/iot/upload'
*/
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/api/iot/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\IotDataController::upload
* @see app/Http/Controllers/Api/IotDataController.php:18
* @route '/api/iot/upload'
*/
upload.url = (options?: RouteQueryOptions) => {




    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\IotDataController::upload
* @see app/Http/Controllers/Api/IotDataController.php:18
* @route '/api/iot/upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\IotDataController::upload
* @see app/Http/Controllers/Api/IotDataController.php:18
* @route '/api/iot/upload'
*/
const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\IotDataController::upload
* @see app/Http/Controllers/Api/IotDataController.php:18
* @route '/api/iot/upload'
*/
uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(options),
    method: 'post',
})

upload.form = uploadForm

const IotDataController = { upload }

export default IotDataController