function EasyText( text, size, color )
{
   var sprite = new Sprite();
   
   if (!color)
      color = 0xffffff;
   
   this.mouseChildren = false;
   
   var format = new TextFormat("Trebuchet MS", size, color);
         
   this.tf = new TextField();
   this.tf.setTextFormat(format);
   this.tf.text = text;
   this.tf.width  = this.tf.textWidth
   this.tf.height = this.tf.textHeight;
   sprite.addChild(this.tf);
   sprite.text_width  = this.tf.textWidth;
   sprite.text_height = this.tf.textHeight;
   return sprite;
}

