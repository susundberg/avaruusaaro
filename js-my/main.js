
/// GLOBAL VARIABLES
var GLOBAL_stage           ;
var GLOBAL_view            = new View();
var GLOBAL_world           ;
var GLOBAL_list_of_objects ;
var GLOBAL_player          ;
var GLOBAL_monster         ; 
var GLOBAL_loop            = 0;

/// Main function
function Start()
{
   GLOBAL_stage      = new Stage("c");
   
   console.log("Loading images ... \n");
   
   var sprite = new Sprite();
   var graphics = sprite.graphics;
   graphics.beginFill(0x202020);
   graphics.drawRect(0,0,800,600);
   var loading_text = new EasyText("Please wait, loading..", 20);
   
   loading_text.x = 200;
   loading_text.y = 100;
   
   GLOBAL_stage.addChild ( sprite );
   GLOBAL_stage.addChild ( loading_text );
   
   GLOBAL_view.loader.start_loading_images();

}

function After_images_have_loaded()
{
   console.log("Loading images DONE, ENTERING WAIT MODE ... \n");
   
   GLOBAL_stage.removeChildAt(1);
   GLOBAL_stage.removeChildAt(0);
   
   GLOBAL_view.game_state = GLOBAL_view.GAME_STATE_READY;
   GLOBAL_stage.addChild( new Bitmap( GLOBAL_view.loader.screen_start ) );

   GLOBAL_stage.addEventListener(KeyboardEvent.KEY_DOWN  , wait_for_start_handler );
   GLOBAL_stage.addEventListener(MouseEvent.MOUSE_DOWN, wait_for_start_handler );
}

function wait_for_start_handler()
{
   console.log("SOMETHING HAPPENED, entering play mode!");
   GLOBAL_stage.removeEventListener(KeyboardEvent.KEY_DOWN  , wait_for_start_handler );
   GLOBAL_stage.removeEventListener(MouseEvent.MOUSE_DOWN, wait_for_start_handler );
   
   GLOBAL_stage.removeEventListener( Event.ENTER_FRAME, show_end_screen_animation );
   
   GLOBAL_view.game_state = GLOBAL_view.GAME_PLAY;

   GLOBAL_stage.addEventListener(KeyboardEvent.KEY_DOWN, on_key_down );
   GLOBAL_stage.addEventListener(KeyboardEvent.KEY_UP, on_key_up );
   
   Game_start();
}

function Game_end( player_win )
{
   console.log("GAME END!. Player win: " + player_win );
   
   GLOBAL_stage.removeEventListener( Event.ENTER_FRAME, on_update_frame );
   GLOBAL_stage.removeEventListener( KeyboardEvent.KEY_DOWN, on_key_down );
   GLOBAL_stage.removeEventListener( KeyboardEvent.KEY_UP, on_key_up );

   GLOBAL_stage.addEventListener( Event.ENTER_FRAME, wait_for_screen_show_handler );
   
   if ( player_win == false )
   {
      GLOBAL_view.game_state = GLOBAL_view.GAME_STATE_END_LOSE;
      GLOBAL_view.game_timer = GLOBAL_view.game_timer_limit_lose;
      GLOBAL_stage.addChild( new Bitmap( GLOBAL_view.loader.end_lose) );
   }
   else
   {
      GLOBAL_view.game_state = GLOBAL_view.GAME_STATE_END_WIN;
      GLOBAL_view.game_timer = GLOBAL_view.game_timer_limit_win;
      
      GLOBAL_view.win_screen = new Bitmap( GLOBAL_view.loader.end_win) ;
      GLOBAL_view.win_screen.alpha = 0.0;
      
      GLOBAL_stage.addChild( GLOBAL_view.win_screen  );
   }
}

function wait_for_screen_show_handler( e )
{
   if ( GLOBAL_view.game_state == GLOBAL_view.GAME_STATE_END_WIN )
   {
      var alpha = (GLOBAL_view.game_timer_limit_win - GLOBAL_view.game_timer) / GLOBAL_view.game_timer_limit_win;
      GLOBAL_view.win_screen.alpha = alpha;
   }
   else ( GLOBAL_view.game_state == GLOBAL_view.GAME_STATE_END_WIN )
   {
      Player_update_dead_animation( GLOBAL_player );
   }
   
   if ( GLOBAL_view.game_timer > 0  )
   {
      GLOBAL_view.game_timer --;
      return;
   }
      
   console.log("Time passed enable keys!"); 
   GLOBAL_stage.removeEventListener( Event.ENTER_FRAME, wait_for_screen_show_handler );
   
   if ( GLOBAL_view.game_state == GLOBAL_view.GAME_STATE_END_WIN )
   {
      GLOBAL_view.credits = new Bitmap( GLOBAL_view.loader.credits );
      GLOBAL_view.credits.x = GLOBAL_view.view_xsize ;
      GLOBAL_view.credits.y = 10;
      GLOBAL_stage.addChild( GLOBAL_view.credits  );
   }
   
   GLOBAL_stage.addEventListener( Event.ENTER_FRAME, show_end_screen_animation );
   
   GLOBAL_stage.addEventListener(KeyboardEvent.KEY_DOWN  , wait_for_start_handler );
   GLOBAL_stage.addEventListener(MouseEvent.MOUSE_DOWN, wait_for_start_handler );
}


function show_end_screen_animation( e ) 
{
   if ( GLOBAL_view.game_state == GLOBAL_view.GAME_STATE_END_WIN )
   {
      GLOBAL_view.credits.x = GLOBAL_view.credits.x - 1;
      
      if ( GLOBAL_view.credits.x + GLOBAL_view.loader.credits.width <  0 ) 
      {
         GLOBAL_view.credits.x = GLOBAL_view.view_xsize  + 30;
         
      }
   }
   else
   {
       Player_update_dead_animation( GLOBAL_player );
   }
}




function Game_start()
{
   GLOBAL_view            ;
   GLOBAL_world           = new Box2D.Dynamics.b2World( new  Box2D.Common.Math.b2Vec2(0, 9.81),  true);
   GLOBAL_world.SetContactListener(  GetContactListener() );
   GLOBAL_list_of_objects = [];

   // Set screen to correspond to 10m
   GLOBAL_view.set_pixel_size( GLOBAL_stage.stageWidth, GLOBAL_stage.stageHeight, 10.0 );
   
   GLOBAL_list_of_objects.push( factory_create_sky (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view ) );
   
   var bg_image = GLOBAL_view.loader.background;
   
   var bg_xsize = bg_image.width  * GLOBAL_view.pixel_to_real * GLOBAL_view.loader.background_multi * 2;
   var bg_ysize = bg_image.height * GLOBAL_view.pixel_to_real ;
   
   GLOBAL_view.full_scene_real_x = bg_xsize;
   GLOBAL_view.full_scene_real_y = bg_ysize;
   
   GLOBAL_list_of_objects.push( factory_create_floor (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 200, 2  ,  0.0, -bg_ysize*2, 0x100010 ) );
   
   // create walls that cannot be surpassed so that full view is covered with background
   /*
   GLOBAL_list_of_objects.push( factory_create_floor (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 2.0, 200.0, -0.5*bg_xsize + GLOBAL_view.view_real_offset_x, -100.0, 0xF0F0F0 ) );
   GLOBAL_list_of_objects.push( factory_create_floor (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 2.0, 200.0,  0.5*bg_xsize - GLOBAL_view.view_real_offset_x, -100.0, 0xF0F0F0 ) );
   */
   GLOBAL_player  = factory_create_player(   GLOBAL_world,  GLOBAL_stage, GLOBAL_view );
   GLOBAL_list_of_objects.push( GLOBAL_player );
   
   GLOBAL_monster = factory_create_monster(   GLOBAL_world,  GLOBAL_stage, GLOBAL_view );
   
   create_ground( GLOBAL_monster );
   
   // make sure that the monster has something to stand on
   GLOBAL_list_of_objects.push( GLOBAL_monster );
   
   GLOBAL_view.create_hud( );
   GLOBAL_stage.addChild( GLOBAL_view.hud );
   GLOBAL_stage.addEventListener(Event.ENTER_FRAME, on_update_frame );
}



function create_ground( monster )
{
   var bg_xsize = GLOBAL_view.full_scene_real_x;
   var bg_ysize = GLOBAL_view.full_scene_real_y;
   
   // Create floor with some holes
   var start_location = 0;
   
   var hole_size_min  = 1;
   var hole_size_max  = 3;
   
   var ground_size_min = 8;
   var ground_size_max = 14;
   
   var prop_ground_has_cactus = 0.5;
   
   // make sure monster has something to stand on
   var ground_size  =  0.5*bg_xsize - (monster.target_x - monster.real_size_x*0.5);
   var ground_center =  0.5*bg_xsize - 0.5*ground_size;
   
   var turret_real_size = GLOBAL_view.loader.turret.width * GLOBAL_view.pixel_to_real;
   
   console.log("Ground for monster: " + ground_center + "," + ground_size*0.5 );
   var ground = factory_create_floor (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 
                                         ground_size, 4  ,  ground_center ,  2.0, 0x686868 );
                                            
   GLOBAL_list_of_objects.push(  ground );

   start_location = ground_center - ground_size*0.5 - hole_size_max;
   
   while ( start_location > -0.5*bg_xsize )
   {
      
      var ground_size = ground_size_min + Math.random()*ground_size_max;
      

      console.log("Create floor on " + (start_location - ground_size) + " -> " + (start_location ) );
      
      var ground = factory_create_floor (   GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 
                                            ground_size, 4  ,  start_location - 0.5*ground_size ,  2.0, 0x686868 );
      
      GLOBAL_list_of_objects.push(  ground );
      
      var next_turret = start_location - ground_size ;
      while( true )
      {
         next_turret = next_turret  + prop_ground_has_cactus * Math.random() * ground_size + turret_real_size*2;
         
         if ( next_turret > start_location - turret_real_size*2 ) 
            break;
         
         console.log("Add turret to " + ( next_turret) );
         
           
         var turret = factory_create_turret ( GLOBAL_world,  GLOBAL_stage, GLOBAL_view, 
                                              next_turret);
      
         GLOBAL_list_of_objects.push( turret );  
         
      }
      
      
      
      var hole_size   = hole_size_min + Math.random()*hole_size_max;
      
      start_location  = start_location - hole_size - ground_size;
      
   }
   
}


function on_update_frame( e )
{
   GLOBAL_world.Step(1 / 60,  3,  3);
   GLOBAL_world.ClearForces();

   var pos        = GLOBAL_player.body.GetPosition();
   GLOBAL_view.set_view_center( pos.x, pos.y );
   
   var game_to_end     = false;
   var game_end_result = false;
   if ( pos.y > 2.0 )
   {
      game_to_end     = true;
      game_end_result = false;
   }
   
   if ( Player_update( GLOBAL_player ) == false )
   {
      game_to_end     = true;
      game_end_result = false;
   }
   
   var ret =  Monster_update( GLOBAL_monster, GLOBAL_player );
   
   if ( ret == 0 )
   {
   }
   else if ( ret == 2 )
   {
      var bullet = factory_create_cannon(  GLOBAL_world,  GLOBAL_stage, GLOBAL_view, GLOBAL_monster );
      GLOBAL_list_of_objects.push( bullet );
   }
   else if ( ret == 1 )
   {
      game_to_end     = true;
      game_end_result = true;
   }
   
   draw_frame( GLOBAL_view, GLOBAL_list_of_objects );
   GLOBAL_view.update_hud( GLOBAL_player, GLOBAL_monster );
   
   GLOBAL_loop = GLOBAL_loop + 1;   
   
   if ( game_to_end == true )
   {
      Game_end( game_end_result  );
   }

}


function on_key_up( e )
{
   if (e.keyCode == 87 )
   {
      GLOBAL_player.thruster_lifted = 1;
   }
   else if (e.keyCode == 68 )
   {
       GLOBAL_player.thruster_side = 0 ;
   }
   else if (e.keyCode == 65 )
   {
       GLOBAL_player.thruster_side = 0 ;
   }
}

function on_key_down( e )
{
   
   if (e.keyCode == 87 )
   {
      if (  GLOBAL_player.thruster_lifted == 1 )
      {
         Player_apply_thrust( GLOBAL_player, 0.0, -1.0 );
         GLOBAL_player.thruster_lifted = 0;
      }
   }
   else if (e.keyCode == 68 )
   {
      GLOBAL_player.thruster_side = -1.0;
   }
   else if (e.keyCode == 65 )
   {
      GLOBAL_player.thruster_side =  1.0;
   }
   else if (e.keyCode == 32 )
   {
      if ( Player_shoot( GLOBAL_player ) == true )
      {
               
            var bullet = factory_create_bullet (  GLOBAL_world,  GLOBAL_stage, GLOBAL_view, GLOBAL_player.body.GetPosition(), GLOBAL_player.heading );
            Player_shoot_bullet( GLOBAL_player, bullet );
            GLOBAL_list_of_objects.push( bullet );
      }
   }
}


