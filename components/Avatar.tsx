import { rings } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import Image from 'next/image';
import React from 'react'

interface PropTypes {
    seed: string;
    className?: string;
}

function Avatar({seed, className}: PropTypes) {
    const avatar = createAvatar(rings, {
        seed
    })

    const svg = avatar.toString();

    const dataURL = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    return (
        <Image 
            src={dataURL}
            alt={seed}
            width={70}
            height={70}
            className={className}
        />
    )
}

export default Avatar