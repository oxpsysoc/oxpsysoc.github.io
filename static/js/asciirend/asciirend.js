let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @returns {number}
*/
export function new_scene() {
    const ret = wasm.new_scene();
    return ret >>> 0;
}

/**
* @param {number} scene
*/
export function remove_scene(scene) {
    wasm.remove_scene(scene);
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {number} scene
* @returns {string}
*/
export function scene_to_json(scene) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scene_to_json(retptr, scene);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} scene
* @returns {number}
*/
export function scene_from_json(scene) {
    const ptr0 = passStringToWasm0(scene, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.scene_from_json(ptr0, len0);
    return ret >>> 0;
}

/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {Vec3}
*/
export function vec3(x, y, z) {
    const ret = wasm.vec3(x, y, z);
    return Vec3.__wrap(ret);
}

/**
* @param {TermColorMode} colors
* @returns {ColorConvParams}
*/
export function color_conv(colors) {
    const ret = wasm.color_conv(colors);
    return ColorConvParams.__wrap(ret);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {number} scene
* @param {number} obj
* @param {Vec3} pos
* @param {Vec3} rot
* @param {Vec3} scale
*/
export function set_obj_transform(scene, obj, pos, rot, scale) {
    _assertClass(pos, Vec3);
    var ptr0 = pos.__destroy_into_raw();
    _assertClass(rot, Vec3);
    var ptr1 = rot.__destroy_into_raw();
    _assertClass(scale, Vec3);
    var ptr2 = scale.__destroy_into_raw();
    wasm.set_obj_transform(scene, obj, ptr0, ptr1, ptr2);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* @param {number} scene
* @param {StandardMaterial} material
* @param {Vec3} size
* @param {string | undefined} [text]
* @returns {number | undefined}
*/
export function add_cube(scene, material, size, text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(size, Vec3);
        var ptr0 = size.__destroy_into_raw();
        var ptr1 = isLikeNone(text) ? 0 : passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.add_cube(retptr, scene, material, ptr0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} scene
* @param {StandardMaterial} material
* @param {Vec3} start
* @param {Vec3} end
* @param {string | undefined} [text]
* @returns {number | undefined}
*/
export function add_line(scene, material, start, end, text) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(start, Vec3);
        var ptr0 = start.__destroy_into_raw();
        _assertClass(end, Vec3);
        var ptr1 = end.__destroy_into_raw();
        var ptr2 = isLikeNone(text) ? 0 : passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        wasm.add_line(retptr, scene, material, ptr0, ptr1, ptr2, len2);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} scene
* @param {number} object
* @param {string | undefined} [text]
*/
export function set_text(scene, object, text) {
    var ptr0 = isLikeNone(text) ? 0 : passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.set_text(scene, object, ptr0, len0);
}

/**
* @param {number} scene
* @param {number} obj
* @param {Vec3} start
* @param {Vec3} end
*/
export function set_line_points(scene, obj, start, end) {
    _assertClass(start, Vec3);
    var ptr0 = start.__destroy_into_raw();
    _assertClass(end, Vec3);
    var ptr1 = end.__destroy_into_raw();
    wasm.set_line_points(scene, obj, ptr0, ptr1);
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
* Renders a scene into RgbPixel slice.
* @param {number} scene
* @param {ColorConvParams} color_conv
* @param {number} w
* @param {number} h
* @param {number} elapsed
* @returns {(RgbPixel)[]}
*/
export function render(scene, color_conv, w, h, elapsed) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(color_conv, ColorConvParams);
        wasm.render(retptr, scene, color_conv.__wbg_ptr, w, h, elapsed);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} scene
* @param {number} aspect_ratio
*/
export function set_camera_aspect(scene, aspect_ratio) {
    wasm.set_camera_aspect(scene, aspect_ratio);
}

/**
* @param {number} scene
* @param {number} w
* @param {number} h
*/
export function new_frame(scene, w, h) {
    wasm.new_frame(scene, w, h);
}

/**
* @param {number} scene
* @param {boolean} focused
*/
export function event_focus(scene, focused) {
    wasm.event_focus(scene, focused);
}

/**
* @param {number} scene
* @param {number} x
* @param {number} y
*/
export function event_mouse_pos(scene, x, y) {
    wasm.event_mouse_pos(scene, x, y);
}

/**
* @param {number} scene
*/
export function event_mouse_pos_clear(scene) {
    wasm.event_mouse_pos_clear(scene);
}

/**
* @param {number} scene
* @param {boolean} down
* @param {boolean} primary
*/
export function event_mouse_button_state(scene, down, primary) {
    wasm.event_mouse_button_state(scene, down, primary);
}

/**
* @param {number} scene
* @param {number} x
* @param {number} y
*/
export function event_scroll(scene, x, y) {
    wasm.event_scroll(scene, x, y);
}

/**
* @param {number} scene
* @param {Vec3} col
*/
export function set_bg_color(scene, col) {
    _assertClass(col, Vec3);
    var ptr0 = col.__destroy_into_raw();
    wasm.set_bg_color(scene, ptr0);
}

/**
* @param {number} scene
* @param {boolean} count_frames
*/
export function set_dither_count_frames(scene, count_frames) {
    wasm.set_dither_count_frames(scene, count_frames);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
export const TermColorMode = Object.freeze({ SingleCol:0,"0":"SingleCol",Col16:1,"1":"Col16",Col256:2,"2":"Col256",Rgb:3,"3":"Rgb", });
/**
*/
export const ProjectionMode = Object.freeze({ Perspective:0,"0":"Perspective",Orthographic:1,"1":"Orthographic", });
/**
*/
export const StandardMaterial = Object.freeze({ Unlit:0,"0":"Unlit",Diffuse:1,"1":"Diffuse",UiText:2,"2":"UiText", });
/**
*/
export class ColorConvParams {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ColorConvParams.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_colorconvparams_free(ptr);
    }
    /**
    * @returns {TermColorMode}
    */
    get colors() {
        const ret = wasm.__wbg_get_colorconvparams_colors(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {TermColorMode} arg0
    */
    set colors(arg0) {
        wasm.__wbg_set_colorconvparams_colors(this.__wbg_ptr, arg0);
    }
}
/**
*/
export class RgbPixel {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RgbPixel.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rgbpixel_free(ptr);
    }
    /**
    * @returns {number}
    */
    get r() {
        const ret = wasm.__wbg_get_rgbpixel_r(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set r(arg0) {
        wasm.__wbg_set_rgbpixel_r(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get g() {
        const ret = wasm.__wbg_get_rgbpixel_g(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set g(arg0) {
        wasm.__wbg_set_rgbpixel_g(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get b() {
        const ret = wasm.__wbg_get_rgbpixel_b(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set b(arg0) {
        wasm.__wbg_set_rgbpixel_b(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get c() {
        const ret = wasm.__wbg_get_rgbpixel_c(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set c(arg0) {
        wasm.__wbg_set_rgbpixel_c(this.__wbg_ptr, arg0);
    }
}
/**
*/
export class Vec3 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vec3.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vec3_free(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_rgbpixel_new = function(arg0) {
        const ret = RgbPixel.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('asciirend_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
