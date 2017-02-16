

function GetContactListener()
{
   var contactListener = new Box2D.Dynamics.b2ContactListener;
   contactListener.PostSolve= function(contact, impulse ) {
      
   var b2Contact        = Box2D.Dynamics.b2Contact ;
   var b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse ;
   
   var item_a = contact.GetFixtureA().GetUserData();
   var item_b = contact.GetFixtureB().GetUserData();
   
   

   if ( item_a.type > item_b.type )
   {
      var swap = item_b;
      item_b   = item_a;
      item_a   = swap;
   }
   
  // console.log("CONTACT: " + item_a.type + " <-> " + item_b.type + "m" +  DrawObject.TYPE_MONSTER_BULLET);
   
   // If bullet hits anything, then its going to explode
   if ( item_b.type == DrawObject.TYPE_MONSTER_BULLET ) 
   {
      Monster_cannon_hit( item_b );
   }
   else if ( item_a.type == DrawObject.TYPE_MONSTER_BULLET ) 
   {
      Monster_cannon_hit( item_a );
   }
   
   if ( item_b.type == DrawObject.TYPE_TURRET_BULLET ) 
   {
      item_b.remove = true;
   }
   else if ( item_a.type == DrawObject.TYPE_TURRET_BULLET ) 
   {
      item_a.remove = true;
   }
      
      
   
   // If player bullet hits anything, then its going to vanish
   if ( item_b.type == DrawObject.TYPE_PLAYER_BULLET && item_a.type != DrawObject.TYPE_GROUND)
   {
      item_b.remove = true;
   }
   else if ( item_a.type == DrawObject.TYPE_PLAYER_BULLET )
   {
      item_a.remove = true;
   }
   
   // if bullet hits player, player looses life.
   if ( item_a.type == DrawObject.TYPE_PLAYER && item_b.type == DrawObject.TYPE_MONSTER_BULLET )
   {
      Player_hit_by_bullet( item_a );
   }
   if ( item_a.type == DrawObject.TYPE_PLAYER && item_b.type == DrawObject.TYPE_TURRET_BULLET )
   {
      Player_hit_by_bullet( item_a );
   }
   if ( item_a.type == DrawObject.TYPE_PLAYER && item_b.type == DrawObject.TYPE_TURRET )
   {
      Player_hit_by_monster( item_a );
   }
   // if player hit monster, player dies
   if ( item_a.type == DrawObject.TYPE_PLAYER && item_b.type == DrawObject.TYPE_MONSTER )
   {
      Player_hit_by_monster( item_a );
   }
   
   // if player bullet hit monster, monster looses HP
   if ( item_a.type == DrawObject.TYPE_PLAYER_BULLET && item_b.type == DrawObject.TYPE_MONSTER )
   {
      Monster_hit_by_bullet( item_b );
   }
   
   }; // end of contact listener postsolve
   
   return  contactListener;
}
 