function View()
{
   this.camera_x = 0;
   this.camera_y = 0;
   
   this.pixel_to_real = 1.0;
   this.real_to_pixel = 1.0;
   
   this.view_xsize       = 0;
   this.view_ysize       = 0;
   this.monster_location = 0.95;
   this.loader           = new ImageLoader();
   
   this.GAME_STATE_LOADING      = 0;
   this.GAME_STATE_READY        = 1;
   this.GAME_STATE_PLAY         = 2;
   this.GAME_STATE_END_LOSE     = 3;
   this.GAME_STATE_END_WINE     = 4;
   
   this.game_timer             = 0;
   this.game_timer_limit_lose  = 30;
   this.game_timer_limit_win   = 160;
   
   
   this.game_state = this.GAME_STATE_LOADING;
}



/*
function Player_update_hud( player, view )
{
	var graphics = player.hud.graphics;
	
	graphics.clear();
	// FIXME: Rectangle 
	// draw time for next truster shoot rectangle
   graphics.beginFill ( 0xFAC240 , 1.0 );
   var scale = 
   graphics.drawRect  ( player.hud_t1.x, player.hud_t1.y ,  player.hud_t1.width * scale, player.hud_t1.height );
   
	
	// draw warning if we are too high
	if ( player.location_y < player.location_y_limit )
	{
      // TextFormat(font, size, color, bold, italic, align, leading)
      player.hud.addChild(player.hud_t1);
    }
}

*/

View.prototype.create_hud = function (  ) 
{
      this.hud       = new Sprite();
      var view       = this;
      
      this.hud_red_screen = new Sprite();
      
      this.hud_red_screen.graphics.beginFill ( 0xFF0000 , 0.5 );
      this.hud_red_screen.graphics.drawRect  ( 0, 0, 640,480 );
      
      /* DEPRACATED: too high text removed
      this.hud_text_high   = new EasyText( "TOO HIGH", 12,  0xF21111 );
      this.hud_text_high.x = 20;
      this.hud_text_high.y = 20;
      this.hud_text_high_draw = false;

      this.hud_text_fire      = new EasyText( "READY TO FIRE", 12,  0x11F211 );
      this.hud_text_fire.x    = 20;
      this.hud_text_fire.y    = 20 + this.hud_text_high.text_height*1.5;
      this.hud_text_fire_draw = false;
      */
      
      this.hud_monster_hp     = new MBitmap( view.loader.monster_life , 17, 1);
      this.hud_monster_hp.x   = 424;
      this.hud_monster_hp.y   = 10;
      
      this.hud.addChild( this.hud_monster_hp );
      
      this.hud_monster_hp_text = new Bitmap( view.loader.monster_life_text );
      this.hud_monster_hp_text.x = 326;
      this.hud_monster_hp_text.y = 12;
      
      this.hud.addChild( this.hud_monster_hp_text );
      
      
      this.hud_player_hp     = new MBitmap( view.loader.player_life , 3, 1);
      this.hud_player_hp.x   = 77;
      this.hud_player_hp.y   = 10;
      
      this.hud.addChild( this.hud_player_hp );
      
      this.hud_player_hp_text = new Bitmap( view.loader.player_life_text );
      this.hud_player_hp_text.x = 10;
      this.hud_player_hp_text.y = 10;
      
      this.hud.addChild( this.hud_player_hp_text );
      
      this.hud_monster_hp.gotoAndStop( 0 );
      this.hud_player_hp.gotoAndStop( 0 );
}

View.prototype.update_hud = function ( player, monster ) 
{
      var graphics = this.hud.graphics;
      var hud      = this.hud;
      
      var player_frame = this.hud_player_hp.totalFrames - player.hitpoints ;
      if ( player.hitpoints == 0 )
         player_frame = this.hud_player_hp.totalFrames - 1;
      
      var monster_frame = this.hud_monster_hp.totalFrames - monster.hitpoints ;
      if ( monster.hitpoints == 0 )
         monster_frame = this.hud_monster_hp.totalFrames - 1;
      
      this.hud_monster_hp.gotoAndStop( monster_frame );
      this.hud_player_hp.gotoAndStop( player_frame );
      
      if ( player.lose_hitpoint_red_screen == player.lose_hitpoint_red_screen_timer - 1 )
      {
         this.hud.addChild ( this.hud_red_screen );
      }
      else if ( player.lose_hitpoint_red_screen == 0 )
      {
         this.hud.removeChild( this.hud_red_screen );
      }
         
      // graphics.clear();
      
      /* DEPRACATED: too high text removed
       * 
      // draw warning if we are too high
      if ( player.location_y < player.location_y_limit )
      {
      // TextFormat(font, size, color, bold, italic, align, leading)
      if ( this.hud_text_high_draw == false )
      {
         hud.addChild( this.hud_text_high);
         this.hud_text_high_draw = true;
      }
    }
    else
    {
      if ( this.hud_text_high_draw == true )
      {
         hud.removeChild( this.hud_text_high );
         this.hud_text_high_draw = false; 
      }
   }

   if ( player.timer_shoot == 0 )
   {
      // TextFormat(font, size, color, bold, italic, align, leading)
      if ( this.hud_text_fire_draw == false )
      {
         hud.addChild( this.hud_text_fire);
         this.hud_text_fire_draw = true;
      }
    }
    else
    {
      if ( this.hud_text_fire_draw == true )
      {
         hud.removeChild( this.hud_text_fire );
         this.hud_text_fire_draw = false; 
      }
    }    
    */
    
     
     
     
     
     
     
}


View.prototype.set_pixel_size = function( xsize, ysize, full_real_size )
{
   this.view_xsize = xsize;
   this.view_ysize = ysize;
   
   // now pixel_to_real * xsize = full_real_size
   this.pixel_to_real = full_real_size / xsize;
   this.real_to_pixel = 1.0 / this.pixel_to_real ;
   
   this.view_real_offset_x = xsize * this.pixel_to_real * 0.5;
   this.view_real_offset_y = ysize * this.pixel_to_real * 0.5;
    
   return this;
}


View.prototype.set_view_center = function( real_x, real_y )
{
   
    //console.log("Set camera offset to " + real_x + "," + real_y + "+" + this.view_real_offset_y );
   if ( real_y  + this.view_real_offset_y > 1.5 )
     real_y = 1.5 - this.view_real_offset_y;
     
   this.camera_x = real_x - this.view_real_offset_x;
   this.camera_y = real_y - this.view_real_offset_y;
}
