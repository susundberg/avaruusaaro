
///-----------------------------------------------------------------------------------------

///-----------------------------------------------------------------------------------------
function factory_create_cannon( world, stage, view, monster )
{
   var bullet_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   bullet_bodydef.type           = Box2D.Dynamics.b2Body.b2_dynamicBody;
   
   var bullet_fixture             = new Box2D.Dynamics.b2FixtureDef();
   bullet_fixture.shape           = new Box2D.Collision.Shapes.b2PolygonShape();
   bullet_fixture.density         = 4.0;
   bullet_fixture.friction        = 8.0;
   bullet_bodydef.linearDamping   = 0.0;
   
   var image = view.loader.bullet;
   var object_real_size_x = image.width  * view.pixel_to_real;
   var object_real_size_y = image.height * view.pixel_to_real;   
   
   
   var pos      = monster.body.GetPosition();
   
   var monster_anchor_offset_x = monster.hand_anchor_x_real;
   var monster_anchor_offset_y = monster.hand_anchor_y_real;
   
   
   var monster_pipe_x        = (  monster.hand_shoot_x - monster.hand_anchor_x  ) * view.pixel_to_real;
   var monster_pipe_y        = (  monster.hand_shoot_y - monster.hand_anchor_y  ) * view.pixel_to_real;
   
   var vcos = Math.cos(  monster.hand_rotation_current );
   var vsin = Math.sin(  monster.hand_rotation_current );
   
   monster_pipe_x = monster_pipe_x * 1.2;
   monster_pipe_y = monster_pipe_y * 1.2;
   
   var monster_pipe_x_rot = vcos * monster_pipe_x - vsin * monster_pipe_y;
   var monster_pipe_y_rot = vsin * monster_pipe_x + vcos * monster_pipe_y;
   
   
   
   var full_x = pos.x + monster_pipe_x_rot + monster_anchor_offset_x ;
   var full_y = pos.y + monster_pipe_y_rot + monster_anchor_offset_y;
   
   bullet_fixture.shape.SetAsBox( object_real_size_x*0.5 , object_real_size_y*0.5 );
   bullet_bodydef.position.Set( pos.x + monster_pipe_x_rot + monster_anchor_offset_x  , pos.y + monster_pipe_y_rot + monster_anchor_offset_y );
   
   // then let there be body!
   var body = world.CreateBody(bullet_bodydef);
   body.SetAngle(  monster.hand_rotation_current );
   body.SetBullet( true );
   body.CreateFixture(bullet_fixture);
   
   force  = new Box2D.Common.Math.b2Vec2(  - vcos * 15.0 , - vsin * 15.0 );
   offset = body.GetWorldCenter() ;
   body.ApplyImpulse(  force, offset  );
   

   var bitmap  = Loader_new_offset_bitmap( image );
   var sprite  = new Sprite();
   
   sprite.addChild( bitmap );
   
 
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_MONSTER_BULLET );
   
   ret_object.explosion            = new MBitmap( view.loader.explosion, 1, 8 );
   ret_object.explosion.x          = -0.5*(view.loader.explosion.width  - 10 ) / 8.0;
   ret_object.explosion.y          = -0.5*(view.loader.explosion.height - 1  );
   
   
   Monster_cannon_init( ret_object, view );
   
   stage.addChild( ret_object.sprite );
   
   return ret_object;
}



function Monster_cannon_init( cannon, view )
{
   cannon.timer_explode          = -1;
   cannon.timer_explode_limit    = 50;
   cannon.timer_animation        = -1;
   cannon.timer_animation_limit  = 3;
   cannon.animation_direction    = 1;
}

function Monster_cannon_hit( cannon )
{
   
   if ( cannon.timer_explode == -1  )
      cannon.timer_explode = cannon.timer_explode_limit;  
}

function Monster_cannon_update( cannon )
{
      // console.log("Monster cannon update!" +  cannon.timer_explode + "," + cannon.timer_animation );
   if ( cannon.timer_explode > 0 )
   {
      cannon.timer_explode --;
   }
   else if ( cannon.timer_explode == 0 )
   {
      cannon.sprite.removeChildAt(0);
      cannon.sprite.addChild( cannon.explosion );
      cannon.timer_animation = cannon.timer_animation_limit;
      cannon.timer_explode   = -2;
      return 1;
      //console.log("Explosion!");
   }
   else if ( cannon.timer_animation > 0 )
   {
      cannon.timer_animation --;
      //console.log("Animation wait " + cannon.timer_animation );
   }
   else if ( cannon.timer_animation == 0 )
   {
      cannon.timer_animation = cannon.timer_animation_limit;
      // console.log("Next frame, animation at " + cannon.explosion.currentFrame );

      if ( cannon.animation_direction == 1)
      {
         cannon.explosion.nextFrame();
         
         if ( cannon.explosion.currentFrame == 7 )
            cannon.animation_direction = -1;
         else if (cannon.explosion.currentFrame > 2)
            return 3;
         
      }
      else
      {
         cannon.explosion.prevFrame();
         if ( cannon.explosion.currentFrame == 7 )
            return 2;
         else if (cannon.explosion.currentFrame > 2)
            return 3;
      }
   }

   return 0;
}
