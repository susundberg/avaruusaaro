

function DrawObject( body, view, type )
{
   this.sprite = view;
   this.body   = body;
   this.type   = type;
   
   this.remove = false;
   
   if ( type <= DrawObject.PHYS_OBJECT_LIMIT )
   this.body.GetFixtureList().SetUserData( this );
   
   
   return this;
}


DrawObject.TYPE_NONE           = 0;
DrawObject.TYPE_GROUND         = 1;

DrawObject.TYPE_PLAYER         = 3;
DrawObject.TYPE_PLAYER_BULLET  = 4;
DrawObject.TYPE_MONSTER        = 5;
DrawObject.TYPE_MONSTER_BULLET = 6;
DrawObject.TYPE_TURRET         = 7;
DrawObject.TYPE_TURRET_BULLET  = 8;

DrawObject.PHYS_OBJECT_LIMIT = 90;
DrawObject.TYPE_SKY          = 98;
DrawObject.TYPE_NON_OBJECT   = 99;

function NonPhysBody( x, y )
{
   this.pos = new Box2D.Common.Math.b2Vec2( x,y );
   return this;
}

NonPhysBody.prototype.GetPosition =  function()
{
   return this.pos; 
}

NonPhysBody.prototype.GetAngle =  function()
{
   return 0;
}
