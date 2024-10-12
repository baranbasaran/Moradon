package com.baranbasaran.cheaperbook.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class MediaService {

    // This is a simple example. You can change the path to where you'd like to save media files.
    private final String uploadDir = "/path/to/upload";

    public String upload(MultipartFile file) {
        try {
            File targetFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(targetFile);

            // Return the URL or path where the file is accessible.
            return targetFile.getAbsolutePath(); // Or a URL if hosted externally
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload media", e);
        }
    }
}
