import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
update.url = (options?: RouteQueryOptions) => {




    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:194
* @route '/dashboard/admin/config'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
export const sendTelemetry = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTelemetry.url(options),
    method: 'post',
})

sendTelemetry.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config/send-telemetry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetry.url = (options?: RouteQueryOptions) => {




    return sendTelemetry.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetry.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTelemetry.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
const sendTelemetryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendTelemetry.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::sendTelemetry
* @see app/Http/Controllers/AdminController.php:252
* @route '/dashboard/admin/config/send-telemetry'
*/
sendTelemetryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendTelemetry.url(options),
    method: 'post',
})

sendTelemetry.form = sendTelemetryForm

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
export const detectTelegramChat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectTelegramChat.url(options),
    method: 'post',
})

detectTelegramChat.definition = {
    methods: ["post"],
    url: '/dashboard/admin/config/detect-telegram-chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChat.url = (options?: RouteQueryOptions) => {




    return detectTelegramChat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detectTelegramChat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
const detectTelegramChatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: detectTelegramChat.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::detectTelegramChat
* @see app/Http/Controllers/AdminController.php:365
* @route '/dashboard/admin/config/detect-telegram-chat'
*/
detectTelegramChatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: detectTelegramChat.url(options),
    method: 'post',
})

detectTelegramChat.form = detectTelegramChatForm



const config = {
    update: Object.assign(update, update),
    sendTelemetry: Object.assign(sendTelemetry, sendTelemetry),
    detectTelegramChat: Object.assign(detectTelegramChat, detectTelegramChat),
}

export default config