

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
let downsizeInSizeLoc = gl.getUniformLocation(downsizeProgram,"inSize");
let downsizeScaleLoc  = gl.getUniformLocation(downsizeProgram,"scale");




/**
 * 
 * @param {GPUImage} input 
 * @param {GPUImage} output 
 */
function downsize(input,output,scale)
{
    gl.useProgram(downsizeProgram); 
    gl.viewport(0,0,output.width,output.height)

    // if(output.width*scale != input.width || output.height*scale != input.height)
    // {
    //     throw "input output size mismatch";
    // }

    gl.uniform2i(downsizeInSizeLoc,input.width,input.height);
    gl.uniform1i(downsizeScaleLoc,scale);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,input.frontTex);
    gl.bindFramebuffer(gl.FRAMEBUFFER,output.backFb);
    gl.drawArrays(gl.TRIANGLES,0,3);
    output.swapBuffers();
}

var mainBuffer;
var scaledBuffer;

load_img("apriltag_setup.jpg",(data)=>{
    can.width = data.width;
    can.height = data.height;

    mainBuffer = new GPUImage(data.width,data.height);
    scaledBuffer = new GPUImage(Math.floor(data.width/4),Math.floor(data.height/4))

    mainBuffer.writeImage(data);
    downsize(mainBuffer,scaledBuffer,4);

    render(scaledBuffer);
})