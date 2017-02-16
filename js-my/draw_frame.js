
function draw_frame( viewpoint, list_of_objects )
{
   
   var offset_x    = viewpoint.camera_x;
   var offset_y    = viewpoint.camera_y;
   var scale       = viewpoint.real_to_pixel;
   var angle_scale = 180.0/Math.PI;
   
   
   //for ( var i = 0 ; i < list_of_objects.length; i++)
   var i = 0 
   {
      var object      = list_of_objects[i];
       
      var view       = object.sprite;
      var body       = object.body;
      var pos        = body.GetPosition();
      
      view.x        =   ( pos.x - offset_x ) * scale;
      view.y        =   ( pos.y - offset_y ) * scale;
      

      view.x        =   Math.round(( pos.x - offset_x ) * scale);
      view.y        =   Math.round(( pos.y - offset_y ) * scale)
   }
   
   // console.log("Camera offset is " + offset_x + "," + offset_y );
   for ( var i = 1 ; i < list_of_objects.length; i++)
   {
      var object      = list_of_objects[i];
      

      var view       = object.sprite;
      var body       = object.body;
      var pos        = body.GetPosition();
      
      if ( pos.y > 10.0 || object.remove == true )
      {
         GLOBAL_stage.removeChild( view );
         GLOBAL_world.DestroyBody( body );
         delete list_of_objects[i];
         list_of_objects = list_of_objects.splice( i, 1 );
         continue;
      }
      
      
      if ( object.type == DrawObject.TYPE_MONSTER_BULLET )
      {
         var ret = Monster_cannon_update( object );
         
         if ( ret == 1 )
         {
            object.explosion_pos = body.GetPosition();
            GLOBAL_world.DestroyBody( body );
         }
         else if ( ret == 3 )
         {
            Player_handle_explosion( GLOBAL_player, object.explosion_pos  );
         }
         else if ( ret == 2 )
         {
            GLOBAL_stage.removeChild( view );
            
            delete list_of_objects[ i ];
            list_of_objects = list_of_objects.splice( i, 1 );
            
            continue;
         }
      }
      else if ( object.type == DrawObject.TYPE_TURRET )
      {
         var ret = Turret_update( object );
         
         if (ret != 0 )
         {
            var ret = factory_create_turret_bullet( object, GLOBAL_world, GLOBAL_stage, GLOBAL_view, ret );
            list_of_objects.push( ret );
         }
      }
      
      
      view.x        =   ( pos.x - offset_x ) * scale;
      view.y        =   ( pos.y - offset_y ) * scale;
      view.rotation = body.GetAngle() * angle_scale;
     //  if ( i == 0 )
     //    console.log(" DRAW " + i + ":" +  view.x + ","+  view.y + " -- " + pos.x +","+pos.y );
      
        
   }
   
   return;
}
