

      
function factory_create_floor( world, stage, view, object_real_size_x, object_real_size_y, pos_x, pos_y, color )
{
   // Create 'floor' 
   var floor_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   floor_bodydef.type           = Box2D.Dynamics.b2Body.b2_staticBody;
   
   var floor_fixture             = new Box2D.Dynamics.b2FixtureDef();
   floor_fixture.shape           = new Box2D.Collision.Shapes.b2PolygonShape();

   floor_fixture.shape.SetAsBox( object_real_size_x*0.5 , object_real_size_y*0.5 );
   floor_fixture.friction        = 4.0;
   floor_bodydef.position.Set( pos_x, pos_y );
   var body = world.CreateBody(floor_bodydef);
   body.CreateFixture(floor_fixture);
   
   var sprite     = new Sprite();  
   var graphics   = sprite.graphics;
   graphics.beginFill ( color  , 1.0 );
   var draw_sx = 0.5*view.real_to_pixel*object_real_size_x;
   var draw_sy = 0.5*view.real_to_pixel*object_real_size_y;
   graphics.drawRect  ( -draw_sx, -draw_sy, 2*draw_sx, 2*draw_sy );
         
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_GROUND );
   
   stage.addChild( sprite );

   return ret_object ;
}


//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function factory_create_sky( world, stage, view )
{

   var image = view.loader.background;
   
   var object_real_size_x = image.width  * view.pixel_to_real;
   var object_real_size_y = image.height * view.pixel_to_real;

   // set image low end (+) to zero
   var body = new NonPhysBody( 0, -object_real_size_y);
   //console.log("MAKE SKY: " +  object_real_size_x + "," + object_real_size_y );
      
     
   var sprite     = new Sprite();  
   
   var graphics = sprite.graphics;
   
   var full_size_x = view.loader.background_multi*2*image.width;
   var full_size_y = view.loader.background_multi*2*image.height;
   
   graphics.beginFill(0x000000);
   graphics.drawRect(-full_size_x ,-full_size_y, full_size_x*2 , full_size_y*2);
   
   var offset = 0;
   for ( var loop = -view.loader.background_multi; loop <= view.loader.background_multi; loop ++ )
   {
      var bitmap = new Bitmap( image , "never", false  ) ;
      bitmap.x = loop*(image.width) + offset ;
      sprite.addChild( bitmap ) ;
      offset = offset - 2;
   }
   
   
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_SKY );
   stage.addChild( sprite );
   return ret_object;
}


//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function factory_create_player( world, stage, view )
{
   // Create 'floor' 
   var player_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   player_bodydef.type           = Box2D.Dynamics.b2Body.b2_dynamicBody;
   
   var player_fixture             = new Box2D.Dynamics.b2FixtureDef();
   player_fixture.shape           = new Box2D.Collision.Shapes.b2PolygonShape();
   player_fixture.density         = 1.0
   player_fixture.friction        = 1.0;
   player_bodydef.linearDamping   = 1.0;
   
   var image = view.loader.player;
   
   // 0.5 for the 2x2 frames we have
   var object_real_size_x = (image.width  -3 ) * view.pixel_to_real * 0.5;
   // 10 due the flame
   var object_real_size_y = (image.height -3 - 10*2) * view.pixel_to_real * 0.5;
   
   player_fixture.shape.SetAsBox( object_real_size_x*0.5 , object_real_size_y*0.5 );
   player_bodydef.position.Set( -60.0, -view.full_scene_real_y*0.5 );
   
   // then let there be body!
   var body = world.CreateBody(player_bodydef);
   body.CreateFixture(player_fixture);
   

   // Ok then we need to tell how to draw this
   var sprite     = new Sprite();  
   
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_PLAYER );

   Player_init( ret_object, view, object_real_size_x, object_real_size_y  );
   Player_draw( ret_object );
   
   stage.addChild( ret_object.sprite );
   return ret_object;
}


//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
function factory_create_bullet( world, stage, view, pos, dir )
{
   var bullet_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   bullet_bodydef.type           = Box2D.Dynamics.b2Body.b2_dynamicBody;
   
   var bullet_fixture             = new Box2D.Dynamics.b2FixtureDef();
   bullet_fixture.shape           = new Box2D.Collision.Shapes.b2CircleShape();
   bullet_fixture.density         = 1.5;
   bullet_fixture.friction        = 0.0;
   bullet_fixture.restitution     = 1.0;
   bullet_bodydef.linearDamping   = 0.0;
   
   var object_real_size_x = 0.1;
   
   var player_x_size = view.loader.player.width * view.pixel_to_real;
   
   bullet_fixture.shape.SetRadius( object_real_size_x );
   bullet_bodydef.position.Set( pos.x + dir*player_x_size , pos.y );
   
   // then let there be body!
   var body = world.CreateBody(bullet_bodydef);
   body.SetBullet( true );
   body.CreateFixture(bullet_fixture);

   var sprite     = new Sprite();  
   var graphics   = sprite.graphics;
   graphics.beginFill ( 0XFFAA00 , 1.0 );
   
   graphics.drawCircle ( 0, 0, view.real_to_pixel*object_real_size_x );

   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_PLAYER_BULLET );
   
   stage.addChild( ret_object.sprite );
   return ret_object;
}


/*

function create_bounding_vertices_for_image( image )
{
   var scale = view.pixel_to_real;
   
   var data = new ArrayBuffer(monster_picture.width*monster_picture.height*4);
   var pixel_image_8bit = new Uint8Array( data  );
   var pixel_image      = new Uint32Array( data );
   
   monster_picture.getPixels( monster_picture.rect,  pixel_image_8bit );
   
   var vertices_left  = [];
   var vertices_right = [];
   
   for ( var yloop = (monster_picture.height - 1); yloop >= 0; yloop -- )
   {
      var first_found = 0;
      var last_found  = 0;
      for ( var xloop = 0; xloop < monster_picture.width; xloop ++ )
      {
         var val = pixel_image[ yloop*monster_picture.width + xloop];
         
         if ( val > 0 && first_found == 0)
         {
            first_found = xloop;
            break;
         }
      }
      
      for ( var xloop = monster_picture.width - 1; xloop >= 0 ; xloop -- )
      {
         var val = pixel_image[ yloop*monster_picture.width + xloop];
         
         if ( val > 0 && first_found == 0)
         {
            last_found = xloop;
            break;
         }
      }
      vertices_left
      // ok now we have last and first on this pixel row
      
      
   }
   
   vertices.push( new b2Vec2( 98  , 250 ) );
   vertices.push( new b2Vec2( 123 , 29 ) );
   vertices.push( new b2Vec2( 184 , 0 ) );
   vertices.push( new b2Vec2( 365 , 0  ) );
   vertices.push( new b2Vec2( 365 , 250 ) );
                
    var off_x = -0.5*monster_picture.width;
    var off_y = -0.5*monster_picture.height;
    
    for ( var loop = 0; loop < vertices.length ; loop ++ )
    {
      var vert = vertices[ loop ];
      
      vert.x = ( vert.x + off_x ) * scale;
      vert.y = ( vert.y + off_y ) * scale;
      console.log("Got item: " +  vert.x + "," + vert.y  );
    }
}      
      */