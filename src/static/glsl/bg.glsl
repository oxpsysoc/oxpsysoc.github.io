#version 300 es

precision mediump float;
in vec2 v_texCoord;
out vec4 fragColor;

uniform int u_frame;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_scroll;

#define M_TAU 6.28318
#define M_PI 3.1415926538

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.4,0.1,0.9);
    vec3 b = vec3(0.9,0.8,0.5);
    vec3 c = vec3(0.7,.6,0.56);
    vec3 d = vec3(0.563,0.316,0.557);

    return a + b*cos( M_TAU*(c*t+d) );
}

vec2 kaleido(vec2 uv, float startTheta, float alpha) {
    uv.y = abs(uv.y);
    alpha = max(alpha, 0.0001);
    vec2 nuv = normalize(uv);
    float th = atan(nuv.y, nuv.x);
    th = th - abs(mod(startTheta, M_TAU));
    th = abs(abs(mod(th, alpha)) - alpha * 0.5);
    float r = length(uv);
    return vec2(cos(th) * sign(uv.x), sin(th)) * r;
}

// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float paletteHue(float x) {
    // Hardcoded values for OPS hues
    const float a = 0.158;
    const float b = 0.545;
    const float c = 0.901;

    // Calculate the absolute differences with wrapping
    float diff_a = min(abs(x - a), 1.0 - abs(x - a));
    float diff_b = min(abs(x - b), 1.0 - abs(x - b));
    float diff_c = min(abs(x - c), 1.0 - abs(x - c));

    // Find the minimum difference
    float min_diff = min(diff_a, min(diff_b, diff_c));

    // Calculate the nearest value without branches
    float nearest = mix(a, b, step(diff_b, diff_a));
    nearest = mix(c, nearest, step(min_diff+0.001, diff_c));

    return nearest;
}

vec3 palette2(vec3 inColor, vec2 uv) {
    vec3 hsv = rgb2hsv(inColor);

    hsv.x = paletteHue(hsv.x);
    hsv.y = 1.0;
    hsv.z = round(hsv.z * 5.0) / 5.0;

    return hsv2rgb(hsv);
}

void main() {
    vec2 texCoord = v_texCoord * u_res;
    vec2 uv = (texCoord * 2.0 - u_res.xy) / u_res.y;

    uv = kaleido(uv, u_scroll / u_res.y + u_time * 0.1, 1. * pow(2. * max(length((u_mouse.xy - u_res.xy * 0.5) / u_res.xy), 0.1), 2.));
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 5.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i*.8 + u_time*0.4*i);

        d = sin(d*20. + u_time)/16.;
        d = abs(d);

        d = pow(0.01 / d, 2.4);

        finalColor += col * d;
    }

    // Tonemap
    finalColor = finalColor / (finalColor + vec3(1.0));

    fragColor = vec4(palette2(finalColor, uv0), 1.0);
}
