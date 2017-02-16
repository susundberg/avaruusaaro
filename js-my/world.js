

PhysWorld.prototype.create_bullet = function( position, angle_x, angly_y )
{
   // create bullet in 1m from this
   
   this.floor_bodydef.position.Set( position.x + angle_x, position.y + angle_y );
     
   var body = world.CreateBody(this.floor_bodydef);
   body.CreateFixture( this.floor_fixture );
     
   // then give it small push
   var b2Vec2 = Box2D.Common.Math.b2Vec2;
   var impulse = new b2Vec( angle_x, angle_y);
   
   impulse.multiply( Math.random() * 10 );
   
   body.ApplyImpulse( body.GetWorldCenter()
   
   Add_new_drawable_object_to_world( body, OBJECT_TYPE_BULLET, 0.02, 0.02 );
   
}

