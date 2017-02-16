
function Player_init( player, view, real_size_x, real_size_y )
{
   
   player.speed_x_abs      = 0;
   player.thruster_side    = 0;
   
   player.hitpoints_timer       = 0;
   player.hitpoints_timer_limit = 100;
   player.hitpoints             = 3;
   
   player.explosion_hit_range   = 2*real_size_x*2*real_size_x;
   player.lose_hitpoint_red_screen         = -1;
   player.lose_hitpoint_red_screen_timer   = 8;
   
   player.heading     = 1;
   player.old_heading = 1;
   
   
   
   player.thruster_on      = 0;
   player.thruster_lifted  = 1;
   player.old_thruster_on  = 0;
   player.thruster_on_time = 10;
   
   
   player.timer_shoot      = 0;
   player.mass             = player.body.GetMass();
   player.body.SetFixedRotation(true);
   

   player.location_y = 0;
   player.location_y_limit = -5;
   
   var bitmapdata = view.loader.player;
   
   player.image_frames = new MBitmap( bitmapdata , 2, 2);
   
   player.image_frames_right_on  = 0;
   player.image_frames_right_off = 1;
   player.image_frames_left_on   = 2;
   player.image_frames_left_off  = 3;
   
   player.image_frames.x = -(bitmapdata.width-3)*0.25;
   player.image_frames.y = -(bitmapdata.height-3  - 10*2)*0.25;
   
   player.dead_animation             = new MBitmap( view.loader.player_dead_animation, 1, 8 );
   player.dead_animation.x           = -0.5*(view.loader.player_dead_animation.width  - 10 ) / 8.0;
   player.dead_animation.y           = -0.5*(view.loader.player_dead_animation.height - 1  );
   player.dead_animation.direction   = 1;
   player.dead_animation.timer_limit = 10;
   player.dead_animation.timer       = 0;
   player.dead_animation.started     = false;
   
   player.sprite.addChild( player.image_frames );
}

function Player_hit_by_bullet( player )
{
   Player_lose_hitpoint( player, 1 );
}

function Player_lose_hitpoint( player, amount )
{
   console.log("Hitpoints timer: " + player.hitpoints_timer );
   
   if ( amount <= 2 && player.hitpoints_timer > 0 )
      return 

   player.hitpoints = player.hitpoints - amount;
   
   player.hitpoints_timer = player.hitpoints_timer_limit;
   
   player.lose_hitpoint_red_screen = player.lose_hitpoint_red_screen_timer;
   
   console.log("Hitpoints now left: " + player.hitpoints  );
   
   if ( player.hitpoints < 0)
      player.hitpoints  = 0;
   
}

function Player_handle_explosion( player, exp_position )
{
   var pos = player.body.GetPosition();
   var dx = pos.x -exp_position.x;
   var dy = pos.y -exp_position.y;
   var dist = dx*dx + dy*dy ;
      
   if ( dist <= player.explosion_hit_range)
      Player_lose_hitpoint( player, 10 )
      
}

function Player_hit_by_monster( player )
{
   player.hitpoints = 0;
}

function Player_apply_thrust( player, x, y ) 
{
      
   var location_y = player.body.GetPosition().y;
   player.location_y = location_y;
      
   
   if ( player.location_y < player.location_y_limit || player.thruster_on > 0 )
      y = 0;
   
   if ( player.speed_x_abs > 5.0 )
      x = 0;
   
   var offset = player.body.GetWorldCenter() ;
   var force  = new Box2D.Common.Math.b2Vec2( x, y );
   
   if ( y < 0 )
      player.thruster_on = player.thruster_on_time;
   
   player.body.ApplyImpulse(  force , offset );
   
   
}




function Player_shoot( player )
{
   if ( player.timer_shoot > 0 ) 
      return false;
   
   player.timer_shoot = 100;
   console.log("FIRE!");
   return true;
}

function Player_shoot_bullet( player, bullet )
{

   var force  = new Box2D.Common.Math.b2Vec2( - player.heading*0.5 , 0 );
   var offset = player.body.GetWorldCenter() ;
   //player.body.ApplyImpulse(  force, offset  );
   
   force  = new Box2D.Common.Math.b2Vec2(   player.heading*0.5 , 0 );
   offset = bullet.body.GetWorldCenter() ;
   bullet.body.ApplyImpulse(  force, offset  );
   
   var pos = player.body.GetPosition();
   console.log("Player position is " + pos.x + "," + pos.y );
}


function Player_draw( player )
{
   if ( player.heading > 0 ) 
   {     
      if ( player.thruster_on > 0 ) 
         player.image_frames.gotoAndStop( player.image_frames_right_on  );
      else
         player.image_frames.gotoAndStop( player.image_frames_right_off );
   }
   else
   {
      if ( player.thruster_on > 0 ) 
         player.image_frames.gotoAndStop( player.image_frames_left_on  );
      else
         player.image_frames.gotoAndStop( player.image_frames_left_off );
   } 
}

function Player_update_dead_animation( player )
{
   if ( player.dead_animation.timer > 0 )
   {
      player.dead_animation.timer --
      return 1;
   }
   else
   {
      player.dead_animation.timer  = player.dead_animation.timer_limit;
   }
   console.log("ANIMATION RUN");   
   if ( player.dead_animation.direction == 1)
   {
      player.dead_animation.nextFrame();
      
      if ( player.dead_animation.currentFrame == 7 )
         player.dead_animation.direction = -1;
   }
   else
   {
      player.dead_animation.prevFrame();
      
      if ( player.dead_animation.currentFrame == 1 )
          player.dead_animation.direction = 1;
   }
}

function Player_update( player )
{
   if ( player.hitpoints <= 0 )
   {
      if ( player.dead_animation.started == false )
      {
         console.log("START ANIMATION");
         player.sprite.removeChildAt(0);
         player.sprite.addChild( player.dead_animation );
      }
      
      player.dead_animation.started = true
      
      return false;
   }
   
   if ( player.lose_hitpoint_red_screen >= 0 )
      player.lose_hitpoint_red_screen --;
   
   if ( player.hitpoints_timer > 0)
      player.hitpoints_timer --;

   var speed         = player.body.GetLinearVelocity();
   
   var speed_x_abs = Math.abs( speed.x );
   player.speed_x_abs  = speed_x_abs ;

   // get rid of weird riddling near stop
   if ( speed_x_abs > 0.001 )
   {
      if (speed.x > 0 )
         player.heading =  1;
      else
         player.heading = -1;
      
      var location_y = player.body.GetPosition().y;
      player.location_y = location_y;
      
      // Ground friction
      if ( location_y > -2.6 && speed_x_abs > 0.001 ) 
      {
               // console.log("Location " + location_y + " speed: " + speed.x );
         var force  = new Box2D.Common.Math.b2Vec2( -0.10*speed.x*player.mass , 0 );
         var offset = player.body.GetWorldCenter() ;
               player.body.ApplyImpulse(  force , offset );
      }

   }
   else
   {
      player.body.SetLinearVelocity(  new Box2D.Common.Math.b2Vec2( 0.0 ,  speed.y ) );
   }
   
   
   
   
   if ( player.thruster_side != 0 )
   {
      // console.log("Apply side burst:" + player.thruster_side );
      Player_apply_thrust( player, -player.thruster_side*0.20, 0.0 );
   }
   

   
   var redraw = 0;
   
   if ( player.timer_shoot > 0 )
      player.timer_shoot = player.timer_shoot - 1;
      
   if ( player.thruster_on > 0  )
   {
      player.thruster_on = player.thruster_on - 1; 
      
      if ( player.thruster_on == 0 || player.old_thruster_on == 0 )
      {
         redraw = 1;   
      }
      player.old_thurster_on = player.thruster_on ;   
   }
   
   
   if ( player.old_heading != player.heading )
   {
      redraw = 1;
      player.old_heading = player.heading;
   }
   
   if ( redraw == 1 )
    Player_draw( player );

}
