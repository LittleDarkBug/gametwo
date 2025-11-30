#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_sources[10]; // x, y, freq
uniform int u_sourceCount;

out vec4 fragColor;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // Correct aspect ratio
    st.x *= u_resolution.x / u_resolution.y;
    
    float amplitude = 0.0;
    
    for(int i = 0; i < 10; i++) {
        if(i >= u_sourceCount) break;
        
        vec3 source = u_sources[i];
        vec2 sourcePos = vec2(source.x, source.y);
        // Correct aspect ratio for source position too
        sourcePos.x *= u_resolution.x / u_resolution.y;
        
        float dist = distance(st, sourcePos);
        float freq = source.z;
        
        // Wave function: sin(dist * freq - time)
        // Attenuation: 1.0 / (1.0 + dist * 2.0)
        float wave = sin(dist * 40.0 * freq - u_time * 5.0);
        float attenuation = 1.0 / (1.0 + dist * 5.0);
        
        amplitude += wave * attenuation;
    }
    
    // Visualize amplitude
    // Map -1..1 to color
    // Use absolute value for "energy" visualization or keep phase for interference
    
    float intensity = abs(amplitude);
    
    // Color mapping
    vec3 color = vec3(0.0);
    
    // Simple heatmap: Blue (low) -> Cyan -> White (high)
    color = mix(vec3(0.0, 0.0, 0.2), vec3(0.0, 1.0, 1.0), intensity);
    color = mix(color, vec3(1.0, 1.0, 1.0), smoothstep(0.8, 1.2, intensity));
    
    // Add "interference lines" where amplitude is near 0 (destructive interference)
    // or near max (constructive)
    
    fragColor = vec4(color, 1.0);
}
