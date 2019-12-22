
//Global variables

p=new Array();
mx=0;			// mouse x
my=0;			// mouse y	
radius=1;		// radius
coef=0;			// coef
w=0;			// canvas width
h=0;			// canvas height.
ra=5;			// particle size.

//Class Pa for particle.
function Pa(ox,oy,c,s)
{
	this.x=0;		// center x coordinate
	this.y=0;		// center y coordinate
	this.ox=ox;		// offset x
	this.oy=oy;		// offset y
	this.c=c;		// colour
	this.speed=s;	// speed
	this.sx=0;		// shake x
	this.sy=0;		// shake y
}  

//Program start
window.onload=function() 
{
	a=document.getElementById('canv');
	$=a.getContext('2d');
	
	w=a.width;
	h=a.height;
	mx=w/2;
	my=h/2;

	a.addEventListener('mousemove', function(evt)
	{
		var r=a.getBoundingClientRect();
		mx=evt.clientX-r.left;
		my=evt.clientY-r.top;

		// 0,0 is the center of canvas.
		dx=w/2-mx;
		dy=h/2-my;
		
		coef = Math.sqrt(dx*dx + dy*dy) / ((w+h)/14);

		// If mouse_y is near top or bottom change particle's size. 
		if(my < h*0.3 && ra > 1)
			ra--;
		
		if(my > h*0.7 && ra <10)
			ra++; 
	},false);
		
	// loop function that recycles "for"
	myLoop(0); 
	
	// Animate
	animate();
};

// Clear canvas, update positions.
function animate() 
{
	$.clearRect(0,0,w,h);
	
	myLoop(1);
	
	// Canvas rectangle
	$.beginPath();
   $.lineWidth = 1;
   $.rect(0, 0, w,h);
   $.stroke();
	
	window.setTimeout(animate, 16);
}

//Perform initialization or update positions. Hack - recycle the function.
//functionality=0 then function update positions.
//functionality=1 then function does initialization.
function myLoop(functionality)
{
	for (var i=500;i>=0;i--)
	{
		if(functionality)
		{
			// Reduce code- there are many places that use p[i].
			l=p[i];	
			
			// Update position using custom Xenon theorem (half path between two points)
			// in this case a proportional distance between source and target given by .t
			l.x+=(mx-l.x)/l.speed;
			l.y+=(my-l.y)/l.speed;
			
			l.sx=Math.random();
			l.sy=Math.random();
			$.beginPath();
			
			// Use "arc" to draw circle, but 6.28318-coef for special effect.
			$.arc(l.x+l.ox+l.sx, l.y+l.oy+l.sy, ra,0,6.28318-coef);
			$.fillStyle=l.c;
			$.fill();
			$.strokeStyle=l.c;
			$.stroke();
		}
		else
		{
			// Convert to radian.(will effect length/width of system
			angle = (137.5077 * Math.PI / 180 * i);	
			
			// Each 5 loops, perform radius variation. Higher the mod #, narrower the partical tunnel
			if ((i % 6) == 0)						
				radius +=2;
			
			// Hack: use speed to generate color and make it depend on radius.
			speed = radius + 4;
			
			// Create and initialize particle item. 
			pr=new Pa(
				Math.cos(angle)*radius,
				Math.sin(angle)*radius,
				'rgba('+speed*4+','+speed+','+speed*12+','+(0.8)+')',
				speed);
			p.push(pr);
		}
	}
}