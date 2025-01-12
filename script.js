

var downsizeProgram = createShaderProgram(generic_vs_code,
    `#version 300 es
    precision highp float;
    in vec2 v_position;

    uniform ivec2 inSize;
    uniform int scale;

    uniform sampler2D input_tex0;

    out vec4 FragColor;
    
    void main()
    {
        int ix = int(0.5*(v_position.x+1.0)*float(inSize.x/scale))*scale;
        int iy = int(0.5*(v_position.y+1.0)*float(inSize.y/scale))*scale;
        
        vec4 outColor;

        for(int y = 0; y < scale; y++)
        {
            for(int x = 0; x < scale; x++)
            {
                outColor += texelFetch(input_tex0, ivec2(ix+x,iy+y),0)/float(scale*scale);
            }
        }
        outColor.a = 1.0;

        FragColor = outColor;
    }
    `
);


let mainBuffer;
load_img("apriltags_30mm.png",(data)=>{
    can.width = data.width;
    can.height = data.height;

    mainBuffer = new GPUImage(data.width,data.height);

    mainBuffer.writeImage(data);
    render(mainBuffer);
})