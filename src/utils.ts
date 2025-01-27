export function random(len){
    const option="sjdahklioqndbvsxs12345698@$%&";
    const length=option.length;
    let ans="";
    for(let i=0;i<len;i++){
        ans+=option[Math.floor((Math.random())*length)]

    }
    return ans;
}