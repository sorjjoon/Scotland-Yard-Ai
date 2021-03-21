export function worker(start:number, timeout:number) {
    var end = Date.now() + timeout

    while(Date.now() < end) {
        start+=0.1
    }

    return start

}