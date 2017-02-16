
function Monster_init( monster, view, target_x, target_y )
{
      
      monster.old_heading = 1;
               
      monster.hitpoints            = 17;
      
      monster.timer_shoot          = 0;
      monster.timer_shoot_min      = 30;
      monster.timer_shoot_var      = 60;
     
      monster.timer_jump           = 0;
      monster.timer_jump_min       = 80;
      monster.timer_jump_max       = 30;
      
      monster.timer_help           = -1;
      monster.timer_help_show      = 60;
      
      monster.jump_force_x         = 5;
      monster.jump_force_min       = 1;
      monster.jump_force_max       = 2;
      monster.jump_force_super     = 6;
      monster.jump_force_super_prp = 0.10;
      
      monster.hand_rotation_direction   = -0.5;
      monster.hand_rotation_low         = -50;
      monster.hand_rotation_high        =  45;
      monster.hand_rotation_current     =  0; 
      monster.mass                      = monster.body.GetMass();
      monster.target_x                  = target_x;
      monster.target_y                  = target_y;
      monster.body.SetFixedRotation(true);
      
     var hand_anchor_x = 170;
     var hand_anchor_y = 125;
     monster.hand_shoot_x = 12;
     monster.hand_shoot_y = 80;
     
     monster.image_torso       = Loader_new_offset_bitmap( view.loader.monster_torso ) ;
     monster.image_hand        = new Sprite(); 
    
     var hand = Loader_new_offset_bitmap( view.loader.monster_hand  );
     monster.image_hand.addChild( hand );
     
     monster.image_help = new Bitmap( view.loader.monster_help );
     
     monster.image_help.x = monster.image_torso.x + 250;
     monster.image_help.y = monster.image_torso.y + 70;
     
     
     monster.hand_anchor_x = hand_anchor_x;
     monster.hand_anchor_y = hand_anchor_y;
     
     monster.hand_anchor_x_real = ( monster.hand_anchor_x - view.loader.monster_torso.width  * 0.5  ) * view.pixel_to_real;
     monster.hand_anchor_y_real = ( monster.hand_anchor_y - view.loader.monster_torso.height * 0.5  ) * view.pixel_to_real;

     // calculate anchor point in scaled image, image x is set so that point 0,0 is in the center
     monster.sprite.addChild(  monster.image_hand  );
     monster.sprite.addChild(  monster.image_torso );
     
     monster.real_size_x = object_real_size_x = view.loader.monster_hand .width  * view.pixel_to_real;
     monster.real_size_y = view.loader.monster_hand .height * view.pixel_to_real;

}


function Monster_draw( monster )
{
   var scale = 180.0/Math.PI;
   var hand_pos    = monster.hand_body.GetPosition();
   var monster_pos = monster.body.GetPosition();
   
   monster.image_hand.rotation   = monster.hand_body.GetAngle()*scale;
   monster.image_hand.x         = ( hand_pos.x - monster_pos.x) * GLOBAL_view.real_to_pixel;
   monster.image_hand.y         = ( hand_pos.y - monster_pos.y) * GLOBAL_view.real_to_pixel;
   
   monster.hand_sprite.rotation  = monster.image_hand.rotation;
   monster.hand_sprite.x         = ( hand_pos.x - monster_pos.x) * GLOBAL_view.real_to_pixel;
   monster.hand_sprite.y         = ( hand_pos.y - monster_pos.y) * GLOBAL_view.real_to_pixel;
}


function Monster_shoot_bullet( monster, bullet )
{

}

function Monster_hit_by_bullet( monster )
{
   console.log("Monster has now " + monster.hitpoints + " hitpoints" );
   monster.hitpoints = monster.hitpoints - 1;
   
}

function Monster_update( monster, player )
{
   var shoot = false;
   
   if ( monster.hitpoints == 0 )
      return 1;
   
   var pos = monster.body.GetPosition();
   var player_pos = player.body.GetPosition() ;
   
   Monster_draw( monster );
   
   
   if ( monster.timer_shoot > 0 )
   {
      monster.timer_shoot -- ;
   }
   else
   {
      shoot = true;
      monster.timer_shoot = monster.timer_shoot_min + Math.random() * monster.timer_shoot_var;
   }
   
   
   if ( player_pos.x > pos.x - monster.real_size_x*0.35 && player_pos.y < pos.y)
   {
      if ( pos.y > -10 )
      {
         force  = new Box2D.Common.Math.b2Vec2( 0.0  , -monster.mass*monster.jump_force_super );
         offset = monster.body.GetWorldCenter() ;
         monster.body.ApplyImpulse(  force, offset  );   
      }
         
   }
   else if ( monster.timer_jump > 0 )
   {
      monster.timer_jump -- ;
   }
   else
   {
      
      
      
      monster.timer_jump = monster.timer_jump_min + Math.random()*monster.jump_force_max;
      
      if ( pos.y >= monster.target_y )
      {   
         var rnd     = Math.random();
         var force_y = monster.jump_force_min ;
         
         if ( rnd <= monster.jump_force_super_prp ) 
         {   
            force_y = monster.jump_force_super + rnd*monster.jump_force_super;
         }
         else
         {
            force_y = force_y + rnd*monster.jump_force_max;
         }
         
         var target_x = monster.target_x + monster.jump_force_x*-0.5 + Math.random()*monster.jump_force_x;
         force  = new Box2D.Common.Math.b2Vec2( (-pos.x + target_x)*monster.mass  , -monster.mass*force_y );
         offset = monster.body.GetWorldCenter() ;
         monster.body.ApplyImpulse(  force, offset  );   
      }
      
      if ( monster.timer_help == -1)
      {
         monster.sprite.addChild( monster.image_help );
         monster.timer_help = monster.timer_help_show;
      }
   }
   
   if ( monster.timer_help == 0 )
   {
       monster.sprite.removeChild( monster.image_help );
       monster.timer_help = -1;
   }
   else if ( monster.timer_help > 0 )
   {
       monster.timer_help --;
   }
  
   var hand_angle = monster.hand_body.GetAngle();
   monster.hand_rotation_current = hand_angle;
   if ( hand_angle >= monster.hand_joint_def.upperAngle || hand_angle <= monster.hand_joint_def.lowerAngle )
   {
      monster.hand_joint_def.motorSpeed = -monster.hand_joint_def.motorSpeed ;
      monster.hand_joint.SetMotorSpeed( monster.hand_joint_def.motorSpeed );
   }
  
   if ( shoot == true )
     return 2;
     
   return 0;
}


function factory_create_monster( world, stage, view )
{
   var b2Vec2 = Box2D.Common.Math.b2Vec2;
   
   // Create 'floor' 
   var monster_bodydef            = new  Box2D.Dynamics.b2BodyDef();
   monster_bodydef.type           = Box2D.Dynamics.b2Body.b2_dynamicBody;
   
   var monster_fixture             = new Box2D.Dynamics.b2FixtureDef();
   monster_fixture.shape           = new Box2D.Collision.Shapes.b2PolygonShape();
   monster_fixture.density         = 1.0
   monster_fixture.friction        = 1.0
   monster_bodydef.linearDamping   = 0.0;
   
   
   var monster_picture = view.loader.monster_torso;
   var object_real_size_x = monster_picture.width  * view.pixel_to_real;
   var object_real_size_y = monster_picture.height * view.pixel_to_real;
   
   var sprite     = new Sprite();  

   var vertices = [];
   vertices.push( new b2Vec2( 100.0 , 249.0 ) );
   vertices.push( new b2Vec2( 186.0 , 0.0 ) );
   vertices.push( new b2Vec2( 313.0 , 0.0 ) );
   vertices.push( new b2Vec2( 349.0 , 249.0 ) );
   
   factory_create_polygon_box( view, monster_picture, vertices, sprite );
   monster_fixture.shape.SetAsArray( vertices, vertices.length );
    
   var monster_x =  view.full_scene_real_x*(view.monster_location - 0.5);
   var monster_y = -object_real_size_y*0.5 ;
   
   
   monster_bodydef.position.Set( monster_x , monster_y  );
   
   // then let there be body!
   var body = world.CreateBody(monster_bodydef);
   body.CreateFixture(monster_fixture);
   
   var ret_object = new DrawObject( body, sprite , DrawObject.TYPE_MONSTER );
   
   Monster_init( ret_object, view, monster_x, monster_y  );
   
   
   var monster = ret_object;
   
   monster.hand_sprite = new Sprite();
   sprite.addChild( monster.hand_sprite );
   
   var vertices = [];
   
   vertices.push( new b2Vec2( 14, 65) );
   vertices.push( new b2Vec2( 80, 70) );
   //vertices.push( new b2Vec2( 96, 94) );
   vertices.push( new b2Vec2( 175, 94) );
   vertices.push( new b2Vec2( 175, 137) );
   vertices.push( new b2Vec2( 96, 137) );
   vertices.push( new b2Vec2( 11 , 90 ) );
   /*
   vertices.push( new b2Vec2( 11, 63) );
   vertices.push( new b2Vec2( 186, 92) );
   vertices.push( new b2Vec2( 187, 143) );
   vertices.push( new b2Vec2( 10, 109) );
   */
   factory_create_polygon_box( view, monster_picture, vertices, monster.hand_sprite );
   monster_fixture.shape.SetAsArray( vertices, vertices.length );
   monster.hand_body = world.CreateBody(monster_bodydef);
   monster.hand_body.CreateFixture(monster_fixture);
   monster.hand_body.GetFixtureList().SetUserData( monster );
   
   // Now we have anchor point initialized, make joint
   var joint_def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
   var joint_anchor = new b2Vec2( monster.hand_anchor_x_real + monster_x, monster.hand_anchor_y_real + monster_y );
   
   joint_def.Initialize( monster.body, monster.hand_body, joint_anchor );
   joint_def.enableMotor    = true;
   joint_def.enableLimit    = true;
   joint_def.maxMotorTorque = 1000; // Huh? just guessing?
   
   var angle_scale = Math.PI/180.0;
   joint_def.motorSpeed     = angle_scale*30.0    ;
   joint_def.lowerAngle     = angle_scale*(-45.0) ;
   joint_def.upperAngle     = angle_scale*(45.0 ) ;
   joint_def.referenceAngle = 0.0;
   
   monster.hand_joint_def = joint_def;
   monster.hand_joint = world.CreateJoint( joint_def );
   
   Monster_draw( ret_object );
   stage.addChild( ret_object.sprite );
   
   
   return ret_object;
}



function factory_create_polygon_box( view, image, vertices, sprite )
{
   var scale = view.pixel_to_real;
 
   
    var off_x = -0.5*image.width;
    var off_y = -0.5*image.height;
    
    var graphics = sprite.graphics;
    graphics.lineStyle(3, 0xff0000);
    for ( var loop = 0; loop < vertices.length ; loop ++ )
    {
      var vert = vertices[ loop ];
      
      /*
      if ( loop + 1 < vertices.length )
      {
         var vert_next = vertices[ (loop + 1) ]
         graphics.moveTo( vert.x + off_x, vert.y + off_y);
         graphics.lineTo( vert_next.x + off_x, vert_next.y + off_y);
      }
      */
      
      
      vert.x = ( vert.x + off_x ) * scale;
      vert.y = ( vert.y + off_y ) * scale;
      console.log("Vertex " + vert.x + vert.y );
    }
   // monster_fixture.shape.SetAsBox ( 0.5, 0.5 );
  
}
