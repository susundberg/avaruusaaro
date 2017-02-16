


function ImageLoader()
{
   this.to_load       = 0;
   this.to_load_total = 0;
   this.to_load_total_started = 0;
   return this
}


ImageLoader.prototype.start_loading_images = function ()
{
   this.to_load_total = 17;
   this.monster_torso = this.add_new_image_load( "../resources/monki-torso.png" );
   this.monster_hand  = this.add_new_image_load( "../resources/monki-hand.png" );
   this.monster_help  = this.add_new_image_load( "../resources/monki-help.png" );
   this.monster_life_text  = this.add_new_image_load( "../resources/monki-life-text.png" );
   this.monster_life       = this.add_new_image_load( "../resources/monki-life.png" );
   this.bullet        = this.add_new_image_load( "../resources/bullet.png" );
   this.turret        = this.add_new_image_load( "../resources/cannon.png" );
   this.turret_mirror = this.add_new_image_load( "../resources/cannon_mirror.png" );
   this.background    = this.add_new_image_load( "../resources/bground.png" );
   this.end_lose      = this.add_new_image_load( "../resources/end_lose.png" );
   this.end_win       = this.add_new_image_load( "../resources/end_win.png" );
   this.screen_start  = this.add_new_image_load( "../resources/click_to_start.png" );
   this.explosion     = this.add_new_image_load( "../resources/explosion.png" );
   this.credits       = this.add_new_image_load( "../resources/credits-text.png" );
   
   this.player                 = this.add_new_image_load( "../resources/player.png" );
   this.player_dead_animation  = this.explosion;
   this.player_life            = this.add_new_image_load( "../resources/player-life.png" );
   this.player_life_text       = this.add_new_image_load( "../resources/player-life-text.png" );
   
   
   this.background_multi = 9;
}

ImageLoader.prototype.add_new_image_load = function( filename )
{
   this.to_load       ++;
   this.to_load_total_started ++;
   
   var ret_image = new BitmapData( filename );
   
   ret_image.loader.addEventListener( "complete", loader_loading_done, true );
   
   return ret_image;
   
}

function Loader_new_offset_bitmap(  bmdata )
{
    var ret = new Bitmap( bmdata );
    ret.x = -0.5*bmdata.width;
    ret.y = -0.5*bmdata.height;
    return ret;
}

function loader_loading_done()
{
   var loader = GLOBAL_view.loader;
   loader.to_load --;
   
   if ( loader.to_load == 0 && this.to_load_total_started == this.to_load_total )
   {
      console.log("ALL IMAGES LOADED!");
      
      After_images_have_loaded();
   }
   console.log("Loading done, now to go: " + loader.to_load );
   
}
