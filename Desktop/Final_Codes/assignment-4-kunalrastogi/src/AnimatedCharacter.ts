import * as THREE from 'three'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';

export class AnimatedCharacter extends THREE.Object3D
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;
    private defaultMaterial  = new THREE.MeshLambertMaterial({color : 0xff4200});

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        this.skeleton = new Skeleton(this);
        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
        this.defaultMaterial  = new THREE.MeshLambertMaterial({color : 0xc20808});
    }

    createMeshes(showAxes: boolean): void
    {
        // Here is a good way to check your work -- draw the coordinate axes for each
        // bone.  To start, this will just draw the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you can
        // draw the axes for each bone.
        if(showAxes){
            this.skeleton.rootTransform.add(new THREE.AxesHelper(0.15)); 
        }
        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone, showAxes)
        });
    }

    private createMeshesRecursive(bone: Bone, showAxes: boolean): void
    {
        // TO DO: Draw the bone so that the character will be diplayed as a stick figure
        // You will want to create a thin box mesh that is the length of the bone
        // and then orient it so that it is pointing in the correct direction
        
        // let stickfig = new THREE.BoxGeometry(0.01, 0.01, bone.length);
        // let stickfigmesh = new THREE.Mesh(stickfig, this.defaultMaterial);
        // stickfigmesh.position.copy(bone.direction);
        // stickfigmesh.position.multiplyScalar(bone.length/2);
        // stickfigmesh.lookAt(bone.direction);
        // stickfigmesh.updateMatrix();
        // stickfigmesh.updateMatrixWorld(true);
        // bone.transform.add(stickfigmesh);


        // TO DO: Eventually, you'll want to draw something different depending on which part
        // of the body is being drawn.  An if statement like this is an easy way to do that.
        // You can find the names of additional bones in the .asf files.
        if(bone.name == "head")
        {
            const headcone = new THREE.SphereGeometry(0.08);
            const color = new THREE.MeshBasicMaterial({color: 0xf8d1d1});
            const headmesh = new THREE.Mesh(headcone, color);
            headmesh.position.copy(bone.direction);
            headmesh.position.multiplyScalar(bone.length/2);
            headmesh.lookAt(bone.direction);
            headmesh.updateMatrix();
            headmesh.updateMatrixWorld(true);
            bone.transform.add(headmesh);
        }
        if(bone.name == "upperback")
        {
            const ubacksphere = new THREE.SphereGeometry(0.2,5,5);
            const color = new THREE.MeshBasicMaterial({color: 0xf01909});
            const ubackmesh = new THREE.Mesh(ubacksphere, color);            
            ubackmesh.position.copy(bone.direction);
            ubackmesh.position.multiplyScalar(bone.length/2);
            ubackmesh.lookAt(bone.direction);
            ubackmesh.rotateX(Math.PI/2);
            ubackmesh.updateMatrix();
            ubackmesh.updateMatrixWorld(true);
            bone.transform.add(ubackmesh);
        }

        if(bone.name == "lowerback")
        {
            const lbacksphere = new THREE.SphereGeometry(0.2,8,8);
            const color = new THREE.MeshBasicMaterial({color: 0x019999});
            const lbackmesh = new THREE.Mesh(lbacksphere, this.defaultMaterial);            
            lbackmesh.position.copy(bone.direction);
            lbackmesh.position.multiplyScalar(bone.length/2);
            lbackmesh.lookAt(bone.direction);
            lbackmesh.translateZ(-0.1);
            lbackmesh.updateMatrix();
            lbackmesh.updateMatrixWorld(true);
            bone.transform.add(lbackmesh);
        }

        if(bone.name == "upperneck" || bone.name == "lowerneck"){
            const neckcone = new THREE.CylinderGeometry(0.05, 0.05, (bone.length + 0.01));
            const color = new THREE.MeshBasicMaterial({color: 0xc90076});
            const neckmesh = new THREE.Mesh(neckcone, color);
            neckmesh.position.copy(bone.direction);
            neckmesh.position.multiplyScalar(bone.length/2);
            neckmesh.lookAt(bone.direction);
            neckmesh.updateMatrix();
            neckmesh.updateMatrixWorld(true);
            bone.transform.add(neckmesh);
        }

        if(bone.name == "rclavcile" || bone.name == "lclavcile"){ // Shoulder
            const clavcilecyl = new THREE.BoxGeometry(0.025, 0.025, bone.length);
            const color = new THREE.MeshBasicMaterial({color: 0xffffff});
            const clavcilemesh = new THREE.Mesh(clavcilecyl, color);
            clavcilemesh.position.copy(bone.direction);
            clavcilemesh.position.multiplyScalar(bone.length/2);
            clavcilemesh.lookAt(bone.direction);
            clavcilemesh.translateZ(-0.2);
            clavcilemesh.updateMatrix();
            clavcilemesh.updateMatrixWorld(true);
            bone.transform.add(clavcilemesh);
        }

        if(bone.name == "rhumerus" || bone.name == "lhumerus"){ // Upper Arm
            const humeruscyl = new THREE.CylinderGeometry(0.025, 0.025, (bone.length + 0.05), 10);
            const color = new THREE.MeshBasicMaterial({color: 0xb45f06});
            const humerusmesh = new THREE.Mesh(humeruscyl, color);
            humerusmesh.position.copy(bone.direction);
            humerusmesh.position.multiplyScalar(bone.length/2);
            humerusmesh.lookAt(bone.direction);
            humerusmesh.rotateX(Math.PI/2);
            humerusmesh.translateY(-0.26);
            humerusmesh.updateMatrix();
            humerusmesh.updateMatrixWorld(true);
            bone.transform.add(humerusmesh);
        }

        if(bone.name == "rradius" || bone.name == "lradius"){ // Lower arm
            const radiuscyl = new THREE.CylinderGeometry(0.025, 0.025, (bone.length + 0.05), 10);
            const color = new THREE.MeshBasicMaterial({color: 0xa2c73});
            const radiusmesh = new THREE.Mesh(radiuscyl, color);
            radiusmesh.position.copy(bone.direction);
            radiusmesh.position.multiplyScalar(bone.length/2);
            radiusmesh.lookAt(bone.direction);
            radiusmesh.rotateX(Math.PI/2);
            radiusmesh.translateY(-0.15);
            radiusmesh.updateMatrix();
            radiusmesh.updateMatrixWorld(true);
            bone.transform.add(radiusmesh);
        }

        if(bone.name == "rwrist" || bone.name == "lwrist"){
            const wristsphere = new THREE.BoxGeometry(0.025, 0.025, bone.length);
            const color = new THREE.MeshBasicMaterial({color: 0xffffff});
            const wristmesh = new THREE.Mesh(wristsphere, color);
            wristmesh.position.copy(bone.direction);
            wristmesh.position.multiplyScalar(bone.length/2);
            wristmesh.lookAt(bone.direction);
            wristmesh.rotateX(Math.PI/2);
            wristmesh.translateY(-0.1);
            wristmesh.updateMatrix();
            wristmesh.updateMatrixWorld(true);
            bone.transform.add(wristmesh);
        }

        if(bone.name == "rfemur" || bone.name == "lfemur" ){ // Upper leg
            const femurcyl = new THREE.CylinderGeometry(0.025, 0.025, (bone.length + 0.04), 10);
            const color = new THREE.MeshBasicMaterial({color: 0x123456});
            const femurmesh = new THREE.Mesh(femurcyl, color);
            femurmesh.position.copy(bone.direction);
            femurmesh.position.multiplyScalar(bone.length/2);
            femurmesh.lookAt(bone.direction);
            femurmesh.rotateX(Math.PI/2);
            femurmesh.translateY(-0.42);
            femurmesh.updateMatrix();
            femurmesh.updateMatrixWorld(true);
            bone.transform.add(femurmesh);
        }

        if(bone.name == "rtibia" || bone.name == "ltibia"){ // Lower leg
            const tibiacyl = new THREE.CylinderGeometry(0.025, 0.025, (bone.length + 0.05), 10);
            const color = new THREE.MeshBasicMaterial({color: 0x000000});
            const tibiamesh = new THREE.Mesh(tibiacyl, color);
            tibiamesh.position.copy(bone.direction);
            tibiamesh.position.multiplyScalar(bone.length/2);
            tibiamesh.lookAt(bone.direction);
            tibiamesh.rotateX(Math.PI/2);
            tibiamesh.translateY(-0.4);
            tibiamesh.updateMatrix();
            tibiamesh.updateMatrixWorld(true);
            bone.transform.add(tibiamesh);
        }

        if(bone.name == "rfoot" || bone.name == "lfoot"){ 
            const footcyl = new THREE.CylinderGeometry(0.025, 0.025, bone.length, 10);
            const color = new THREE.MeshBasicMaterial({color: 0xffc000});
            const footmesh = new THREE.Mesh(footcyl, color);
            footmesh.position.copy(bone.direction);
            footmesh.position.multiplyScalar(bone.length/2);
            footmesh.lookAt(bone.direction);
            footmesh.rotateX(Math.PI/2);
            footmesh.translateY(-0.11);
            footmesh.updateMatrix();
            footmesh.updateMatrixWorld(true);
            bone.transform.add(footmesh);
        }

        if(bone.name == "rtoes" || bone.name == "ltoes"){
            const toecyl = new THREE.CylinderGeometry(0.02, 0.025, bone.length, 10);
            const color = new THREE.MeshBasicMaterial({color: 0xa2c723});
            const toemesh = new THREE.Mesh(toecyl, color);
            toemesh.position.copy(bone.direction);
            toemesh.position.multiplyScalar(bone.length/2);
            toemesh.lookAt(bone.direction);
            toemesh.rotateX(Math.PI/2);
            toemesh.translateY(-0.05);
            toemesh.updateMatrix();
            toemesh.updateMatrixWorld(true);
            bone.transform.add(toemesh);
        }
        
        // TO DO: Recursively this function for each of the bone's children
        bone.children.forEach((child: Bone)=> {
            if(child instanceof Bone){
                this.createMeshesRecursive(child, showAxes)
            }
        });
    }

    // No Change below this point
    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = this.overlayQueue[0].frames[overlayFrame].getRootPosition();
                relativeOverlayPosition.sub(this.overlayPose.getRootPosition());

                const relativePosition = this.clip!.frames[currentFrame].getRootPosition();
                relativePosition.sub(this.currentPose.getRootPosition());

                relativeOverlayPosition.lerpVectors(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = this.clip!.frames[currentFrame].getRootPosition();
                relativePosition.sub(this.currentPose.getRootPosition());
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }
}