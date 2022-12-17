import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { GraphicsApp } from './GraphicsApp'
import { AnimatedCharacter } from './AnimatedCharacter'
import { MotionClip } from './MotionClip';
import { Skeleton } from './Skeleton'

enum AppState
{
    STOPPED,
    LOADING_SKELETONS,
    LOADING_ANIMATIONS,
    STARTED
}

export class DanceApp extends GraphicsApp
{ 
    // Animated characters
    private salsaAntLead: AnimatedCharacter;
    private salsaAntFollow: AnimatedCharacter;
    private balletAnt: AnimatedCharacter;
    
    // Motion clips
    private salsaMotionLead: MotionClip;
    private salsaMotionFollow: MotionClip;
    private balletBaseLoop: MotionClip;
    private balletDanceMotions: MotionClip[];

    // State variables
    private state: AppState;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(60, 1920/1080, 0.1, 100);

        this.salsaAntLead = new AnimatedCharacter(60, true);
        this.salsaAntFollow = new AnimatedCharacter(60, true);
        this.balletAnt = new AnimatedCharacter(120, false);

        this.salsaMotionLead = new MotionClip();
        this.salsaMotionFollow = new MotionClip();
        this.balletBaseLoop = new MotionClip();
        this.balletDanceMotions = [];

        this.state = AppState.STOPPED;
    }

    createScene() : void
    {
        // Setup camera
        this.camera.position.set(0, 1.5, 3.5);
        this.camera.lookAt(0, 1, 0);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        const ambientLight = new THREE.AmbientLight('white', 0.3);
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new THREE.DirectionalLight('white', .6);
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight)

        // Load a texture and set it as the background
        this.scene.background = new THREE.TextureLoader().load('assets/images/ants-dance.jpg')

        // Create the wood floor material
        const floorMaterial = new THREE.MeshLambertMaterial();
        floorMaterial.map = new THREE.TextureLoader().load('assets/images/woodfloor.jpg');

        // Create the floor mesh
        const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 6));
        floorMesh.material = floorMaterial;
        floorMesh.rotateX(-Math.PI / 2);
        this.scene.add(floorMesh);

        // Create the GUI
        const gui = new GUI();
        gui.width = 100;

        const controls = gui.addFolder('Ballet Controls');
        controls.open();

        // Add buttons for controlling the motion playback
        controls.add(this, 'playBalletMotion1').name('Motion 1');
        controls.add(this, 'playBalletMotion2').name('Motion 2');
        controls.add(this, 'playBalletMotion3').name('Motion 3');
        controls.add(this, 'playBalletMotion4').name('Motion 4');
        controls.add(this, 'playBalletMotion5').name('Motion 5');

        // Set the initial positions of the characters
        this.salsaAntLead.position.set(1, 0, 0.5);
        this.salsaAntFollow.position.set(1, 0, 0.5);
        this.balletAnt.position.set(-2, 0.95, 0);

        // Load the skeleton data
        // Note that this is asynchronous!
        this.loadSkeletons();
    }

    loadSkeletons(): void
    {
        this.state = AppState.LOADING_SKELETONS;
        this.salsaAntLead.loadSkeleton('./assets/data/60.asf');
        this.salsaAntFollow.loadSkeleton('./assets/data/61.asf'); 
        this.balletAnt.loadSkeleton('./assets/data/61.asf');
    }

    loadAnimations(): void
    {
        this.state = AppState.LOADING_ANIMATIONS;
        this.salsaMotionLead = this.salsaAntLead.loadMotionClip('./assets/data/60_12.amc');
        this.salsaMotionFollow = this.salsaAntLead.loadMotionClip('./assets/data/61_12.amc');

        this.balletBaseLoop = this.balletAnt.loadMotionClip('./assets/data/05_20.amc');
        
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('./assets/data/05_02.amc'));



        // TO DO: Add special motions 2-5 on your own.
        // You can pick your own motions from the CMU mocap database (http://mocap.cs.cmu.edu) or
        // you can use the same dance moves that we did.  
        // We used: 05_10.amc, 05_09.amc, 05_20.amc, and 05_06.amc

        // this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_06.amc'));
        // this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_09.amc'));
        // this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_05.amc'));
        // this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_11.amc')); 
        
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_10.amc'));
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_09.amc'));
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_20.amc'));
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('assets/data/05_06.amc')); 
        
    }

    startAnimations(): void
    {
        this.salsaMotionLead.trimFront(100);
        this.salsaMotionLead.trimBack(150);
        this.salsaMotionLead.makeLoop(100);
        
        this.salsaMotionFollow.trimFront(100);
        this.salsaMotionFollow.trimBack(150);
        this.salsaMotionFollow.makeLoop(100);
        
        this.balletBaseLoop.trimBack(600);
        this.balletBaseLoop.makeLoop(50);

        this.balletDanceMotions[0].trimFront(280);
        this.balletDanceMotions[0].trimBack(200);



        // TO DO: You will need to trim the new animations you have added
        // to isolate the interesting portions of the motion.

        // implementing the same idea as lines 147 & 148
        
        this.balletDanceMotions[1].trimFront(280);
        this.balletDanceMotions[1].trimBack(200);

        this.balletDanceMotions[2].trimFront(280);
        this.balletDanceMotions[2].trimBack(200);

        this.balletDanceMotions[3].trimFront(280);
        this.balletDanceMotions[3].trimBack(200);

        this.balletDanceMotions[4].trimFront(280);
        this.balletDanceMotions[4].trimBack(200);
        
        // No change after this until 236
        
        // You should eventually turn off this boolean flag when you
        // are satisfied that bone transformations are correct
        const showAxes = true; 
        this.salsaAntLead.createMeshes(showAxes);
        this.salsaAntFollow.createMeshes(showAxes);
        this.balletAnt.createMeshes(showAxes);

        this.salsaAntLead.play(this.salsaMotionLead);
        this.salsaAntFollow.play(this.salsaMotionFollow);
        this.balletAnt.play(this.balletBaseLoop);

        // Add the animated characters to the scene
        this.scene.add(this.salsaAntLead);
        this.scene.add(this.salsaAntFollow);
        this.scene.add(this.balletAnt);
    }

    update(deltaTime : number) : void
    {
        if(this.state == AppState.STOPPED)
        {
            return;
        }

        if(this.state == AppState.LOADING_SKELETONS)
        {
            if(Skeleton.finishedLoading())
            {
                this.loadAnimations();
            }
            else
            {
                return;
            }
        }

        if(this.state == AppState.LOADING_ANIMATIONS)
        {
            if(MotionClip.finishedLoading())
            {
                this.state = AppState.STARTED;
                this.startAnimations();
            }
            else
            {
                return;
            }
        }

        this.salsaAntLead.update(deltaTime);
        this.salsaAntFollow.update(deltaTime);
        this.balletAnt.update(deltaTime);
    }

    playBalletMotion1(): void
    {
        this.balletAnt.overlay(this.balletDanceMotions[0], 100);
        console.log('Queueing ballet motion 1. Queue size is ' + this.balletAnt.getQueueCount() + '.');
    }

    // Using same idea as lines 225-229

    playBalletMotion2(): void
    {
        // TO DO: Overlay the motion, similar to the call above
        this.balletAnt.overlay(this.balletDanceMotions[1], 100);
        console.log('Queueing ballet motion 2. Queue size is ' + this.balletAnt.getQueueCount() + '.');

    }

    playBalletMotion3(): void
    {
        // TO DO: Overlay the motion, similar to the call above
        this.balletAnt.overlay(this.balletDanceMotions[2], 100);
        console.log('Queueing ballet motion 3. Queue size is ' + this.balletAnt.getQueueCount() + '.');
    }

    playBalletMotion4(): void
    {
        // TO DO: Overlay the motion, similar to the call above
        this.balletAnt.overlay(this.balletDanceMotions[3], 100);
        console.log('Queueing ballet motion 4. Queue size is ' + this.balletAnt.getQueueCount() + '.');
    }

    playBalletMotion5(): void
    {
        // TO DO: Overlay the motion, similar to the call above
        this.balletAnt.overlay(this.balletDanceMotions[4], 100);
        console.log('Queueing ballet motion 5. Queue size is ' + this.balletAnt.getQueueCount() + '.');
    }
}
