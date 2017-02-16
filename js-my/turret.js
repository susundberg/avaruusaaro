

function Turret_init( turret, view, real_size_x, real_size_y )
{
   
   turret.timer_shoot_min = 50;
   turret.timer_shoot_var = 200;
   
   turret.timer_shoot     = turret.timer_shoot_min + Math.random()*turret.timer_shoot_var;
   
   turret.shoot_direction = -1;
   turret.real_size_x = real_size_x;
   turret.real_size_y = real_size_y;
   
}



//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function factory_create_turret( world, stage, view, pos_x )
{
   // Create 'floor' 
   var turret_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   turret_bodydef.type           = Box2D.Dynamics.b2Body.b2_staticBody;
   
   var turret_fixture             = new Box2D.Dynamics.b2FixtureDef();
   turret_fixture.shape           = new Box2D.Collision.Shapes.b2PolygonShape();
   turret_fixture.density         = 1.0
   turret_fixture.friction        = 1.0;
   turret_bodydef.linearDamping   = 1.0;
   
   var image = view.loader.turret;
   
   // 0.5 for the 2x2 frames we have
   var object_real_size_x = (image.width) * view.pixel_to_real;
   // 10 due the flame
   var object_real_size_y = (image.height) * view.pixel_to_real;
   
   turret_fixture.shape.SetAsBox( object_real_size_x*0.5 , object_real_size_y*0.5 );
   turret_bodydef.position.Set( pos_x , -object_real_size_y*0.5 );
   
   console.log("Create new turret at " + pos_x );
   
   // then let there be body!
   var body = world.CreateBody(turret_bodydef);
   body.CreateFixture(turret_fixture);
   

   // Ok then we need to tell how to draw this
   var sprite     = new Sprite();  
   var bitmap;
   
   if ( Math.random() > 0.5 )
   {
      console.log("NORMAL TURRET");
      bitmap  = Loader_new_offset_bitmap( view.loader.turret );
   }
   else
   {
      console.log("MIRROR TURRET");
      bitmap  = Loader_new_offset_bitmap( view.loader.turret_mirror );
   }
   
   sprite.addChild( bitmap );
   
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_TURRET );

   Turret_init( ret_object, view, object_real_size_x, object_real_size_y  );
   
   stage.addChild( ret_object.sprite );
   return ret_object;
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
function factory_create_turret_bullet( turret, world, stage, view, pos_offset  )
{
   var bullet_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   bullet_bodydef.type           = Box2D.Dynamics.b2Body.b2_dynamicBody;
   
   var bullet_fixture             = new Box2D.Dynamics.b2FixtureDef();
   bullet_fixture.shape           = new Box2D.Collision.Shapes.b2CircleShape();
   bullet_fixture.density         = 0.01;
   bullet_fixture.friction        = 0.0;
   bullet_fixture.restitution     = 1.0;
   bullet_bodydef.linearDamping   = 0.0;
   
   var object_real_size_x = 0.075;
   
   bullet_fixture.shape.SetRadius( object_real_size_x );
   
   if ( pos_offset > 0 )
   {
      pos_x = 61;
   }
   else
   {
      pos_x = 6;
   }
   
   pos_x = (view.loader.turret.width*0.5 - pos_x ) * view.pixel_to_real;
   
   var turret_pos = turret.body.GetPosition();
   
   bullet_bodydef.position.Set( turret_pos.x + pos_x , turret_pos.y - turret.real_size_y * 0.5 - object_real_size_x*2 );
   
   // then let there be body!
   var body = world.CreateBody(bullet_bodydef);
   
   body.SetBullet( true );
   body.CreateFixture(bullet_fixture);
   body.SetFixedRotation(true);
   
   var mass = body.GetMass();
   
   // And let it go up!
   force  = new Box2D.Common.Math.b2Vec2(  (-0.5 + Math.random())*mass , -10*mass );
   offset = body.GetWorldCenter() ;
   body.ApplyImpulse(  force, offset  );

   
   
   var sprite     = new Sprite();  
   var graphics   = sprite.graphics;
   graphics.beginFill ( 0XFF5500 , 1.0 );
   
   graphics.drawCircle ( 0, 0, view.real_to_pixel*object_real_size_x );

   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_TURRET_BULLET );
   
   
   stage.addChild( ret_object.sprite );
   return ret_object;
}


function Turret_update( turret ) 
{
   
   if ( turret.timer_shoot > 0 )
   {
      turret.timer_shoot --;
      return 0;
   }
   else
   {
      turret.timer_shoot     = turret.timer_shoot_min + Math.random()*turret.timer_shoot_var;
      turret.shoot_direction = turret.shoot_direction*(-1);
      
      return turret.shoot_direction ;
   }
}

