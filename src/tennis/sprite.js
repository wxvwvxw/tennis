class Sprite {
    constructor({top, left, width, height, image}) {
      this.image = image;
  
      this.top = top;
      this.left = left;
      this.width = width;
      this.height = height;
      this.ready = false;
    }
  
    isReady(){
      return this.ready;
    }
  
    render(ctx){
      ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
    }
  }
  
  export default Sprite;
  